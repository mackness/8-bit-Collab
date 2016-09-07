// Setup basic express server
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8081;

// Routing
var usernames = {};
var numUsers = 0;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.use(express.static(path.join(__dirname, 'public')));

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


server.listen(port, function() {
  console.log('server listening on ' + port)
});





