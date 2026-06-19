(function () {
  function initPlayer(player) {
    var video = player.querySelector('video[data-source]');
    var overlay = player.querySelector('[data-play-overlay]');
    var button = player.querySelector('[data-play-button]');
    var source = video ? video.getAttribute('data-source') : '';
    var prepared = false;
    var stream = null;

    function prepare() {
      if (!video || !source || prepared) {
        return;
      }
      prepared = true;
      if (window.Hls && window.Hls.isSupported()) {
        stream = new window.Hls({
          maxBufferLength: 42,
          enableWorker: true
        });
        stream.loadSource(source);
        stream.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      if (!video) {
        return;
      }
      prepare();
      video.controls = true;
      player.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          player.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        play();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }

    player.addEventListener('click', function (event) {
      if (event.target === video || event.target === player) {
        play();
      }
    });

    if (video) {
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      video.addEventListener('ended', function () {
        player.classList.remove('is-playing');
      });
      window.addEventListener('beforeunload', function () {
        if (stream && typeof stream.destroy === 'function') {
          stream.destroy();
        }
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
})();
