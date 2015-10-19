$(function() {

  var eightBit = function(){};
  
  eightBit.prototype = {

    initializeGrid: function() {
      var width = $(window).width(),
          height = $(window).height(),
          state = localStorage.getItem('state');

      for (var x = 0; x < width; x++) {
        $('#grid').append('<div class="cell"/>');
      }

      if (state) {
        this.setState();
      }
    },

    setState: function() {
      var state = JSON.parse(localStorage.getItem('state')),
          cell = $('.cell');

      $.each(state, function(i, el) {
        if (state[i].cell) {
          $(cell[i]).addClass('fill');
        }
      });      
    },

    updateState: function() {
      $('.cell').on('click', function() {
        var filled = $(this).hasClass('fill') ? true : false;
        if (filled) {
          $(this).removeClass('fill');
          updateStateArray();
        } else {
          $(this).addClass('fill');
          updateStateArray();
        }
      });

      var updateStateArray = function() {
        stateArray = [];
        $.each($('.cell'), function(i, el) {
          stateArray.push({cell: $(el).hasClass('fill') ? true : false});
        });
        var state = JSON.stringify(stateArray);
        localStorage.setItem('state', state);
      };
    },

    clearState: function() {
      $('.js-clear').on('click', function() {
        var cells = $('.cell');
        $.each(cells, function(i, el) {
          if ($(el).hasClass('fill')) {
            $(el).removeClass('fill');
          }
        });
        window.localStorage.setItem('state', '');
      });      
    },

    init: function() {
      this.initializeGrid();
      this.updateState();
      this.clearState()
    }
  };

  var eightBit = new eightBit();
  eightBit.init();

});