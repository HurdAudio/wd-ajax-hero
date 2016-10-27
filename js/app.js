(function() {
  'use strict';

  var movies = [];

  var renderMovies = function() {
    $('#listings').empty();

    for (var movie of movies) {
      var $col = $('<div class="col s6">');
      var $card = $('<div class="card hoverable">');
      var $content = $('<div class="card-content center">');
      var $title = $('<h6 class="card-title truncate">');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50, });
      $title.text(movie.title);

      var $poster = $('<img class="poster">');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      var $action = $('<div class="card-action center">');
      var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      var $modal = $(`<div id="${movie.id}" class="modal">`);
      var $modalContent = $('<div class="modal-content">');
      var $modalHeader = $('<h4>').text(movie.title);
      var $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      var $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE
  function getPlot(index, filmTitle) {
    var returnString = '';
    var plotString = 'http://www.omdbapi.com/?t=' + filmTitle;
    var $xhr = $.getJSON(plotString);

    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
        return;
      }
      //alert (data.Plot);
      returnString = data.Plot;
      movies[index].plot = returnString;
      // alert(movies[index].plot);
      renderMovies();

    });
  }

  function getMovie(filmInput) {
    movies = [];
    var filmString = 'http://www.omdbapi.com/?s=' + filmInput;
    var $xhr = $.getJSON(filmString);
    var plot = '';

    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
        return;
      }

      console.log(data);
      console.log(data.Search[0].imdbID);
      console.log(data.Search[0].Poster);
      console.log(data.Search[0].Title);
      console.log(data.Search[0].Year);

      for (var i = 0; i < data.Search.length; i++) {
        movies[i] = {};
        plot = getPlot(i, data.Search[i].Title);
        movies[i].id = data.Search[i].imdbID;
        movies[i].poster = data.Search[i].Poster;
        movies[i].title = data.Search[i].Title;
        movies[i].year = data.Search[i].Year;

        // renderMovies();
      }
      // renderMovies();
    });

    $xhr.fail(function(data) {
      console.log('Query failed!');
    });
  }

  $('#submitButton').on('click', function(event) {
    var filmInput = $('#search').val();

    console.log(filmInput);

    if ((filmInput === 'Enter movie title e.g. Jumanji') || (filmInput === '')) {
      alert('Please enter a valid search.');
    } else {
      event.preventDefault();
      console.log('got movie');
      getMovie(filmInput);
      $('#search').val('');
    }

  });
})();
