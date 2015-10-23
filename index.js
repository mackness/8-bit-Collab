// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {

  socket.on('cell changed', function(data) {
    socket.broadcast.emit('update cell', {
      cell: data,
      numUser: numUsers,
      usernames: usernames,
    });
  });

  var addedUser = false;
  socket.on('add user', function (username) {

    socket.username = username;
    usernames[username] = username;
    
    numUsers++;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
  
  console.log('socket connected');

});
