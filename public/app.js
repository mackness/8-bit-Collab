$(function(){

  var socket = io();
  var settings = { 
    bot: false,
    originUser: null 
  };

  var colors = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7',
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7',
  ];
  
  var initializeGrid = function() {
    for (var x = 0; x < 1681; x++) {
      $('#grid').append('<div data-id="'+ x +'" class="cell" />');
    }
  };

  var updateState = function(data) {
    var cell = $('.cell'),
        cellIndex = data.cell.id,
        cellState = data.cell.filled,
        originUser = data.cell.user;

    if (cellState) {
      $(cell[cellIndex]).css('background-color','transparent');
    } else {
      $(cell[cellIndex]).css('background-color', colors[originUser]);
    }
  };

  var handleCellState = function() {
    $('.cell').on('click', function() {
      var filled = $(this).hasClass('filled') ? true : false,
          id = $(this).attr('data-id');

      var data = {
        id: id,
        filled: filled,
        user: settings.originUser,
      };

      if (filled) {
        $(this).removeClass('filled');
        $(this).css('background-color', 'transparent');
        socket.emit('cell changed', data);
      } else {
        $(this).addClass('filled');
        $(this).css('background-color', colors[settings.originUser]);
        socket.emit('cell changed', data);
      }
    });
  };

  var setUsername = function() {
    $('#add-user').on('submit', function(evt) {
      evt.preventDefault();
      var username = $('#add-user input').val();
      socket.emit('add user', username);
    });

    $('body').on('keydown', function() {
      $('#add-user input').focus();
    })
  };

  var addUser = function(data) {
    var me = [
      '<div class="user">',
        '<span class="badge" style="background-color:'+ colors[data.numUsers] +'"></span>',
         '<span>me</span>',
        '</div>',
    ].join('');

    settings.originUser = data.numUsers
    $('#users').append(me);
    $('#add-user').fadeOut();
    if (settings.bot) {
      bot();
    }
  };

  var displayActiveUsers = function(data) {
    var user = [
      '<div class="user">',
        '<span class="badge" style="background-color:'+ colors[data.numUsers] +'"></span>',
         '<span>' + data.username + '</span>',
        '</div>',
    ].join('');

    $('#users').append(user);
    $('#active-users').html(data.numUsers);
  };

  var userLeft = function(data) {
    var user = $('.user');
    $(user[data.numUsers]).fadeOut();
  };

  var activateMenu = function() {
    $('.info').on('click', function() {
      var active = $('body').hasClass('menu-active') ? true : false;
      if (active) {
        $('body').removeClass('menu-active');
      } else {
        $('body').addClass('menu-active');
      }
    });
  };

  var bot = function() {
    setInterval(function() {
      var num =  Math.floor(Math.random() * (1681 - 0 + 1)) + 0,
          cell = $('.cell');
      
      $(cell[num]).click();
      var filled = $(cell[num]).hasClass('fill') ? true : false,
          id = $(cell[num]).attr('data-id');

      var data = {
        id: id,
        filled: filled,
        user: settings.originUser,
      };

      if (filled) {
        $(this).removeClass('fill');
        $(this).css('background-color', 'transparent');
        socket.emit('cell changed', data);
      } else {
        $(this).addClass('fill');
        $(this).css('background-color', colors[settings.originUser]);
        socket.emit('cell changed', data);
      }
    },500);
  };

  //socket events
  socket.on('login', function (data) {
    addUser(data);
  });

  socket.on('user joined', function (data) {
    displayActiveUsers(data);
  });

  socket.on('user left', function (data) {
    userLeft(data);
  });

  socket.on('update cell', function (data) {
    updateState(data);
  });

  var init =  function() {
    initializeGrid();
    setUsername();
    handleCellState();
    activateMenu();
  };

  init();

}); 