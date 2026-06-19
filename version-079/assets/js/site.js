(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) {
      return;
    }

    function update() {
      if (window.scrollY > 18) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-nav]');
    if (!button || !menu) {
      return;
    }

    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = all('[data-hero-slide]');
    var dots = all('[data-hero-dot]');
    if (!slides.length || !dots.length) {
      return;
    }

    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });

    show(0);
    play();
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title') || '',
      card.getAttribute('data-region') || '',
      card.getAttribute('data-type') || '',
      card.getAttribute('data-tags') || '',
      card.getAttribute('data-category') || ''
    ].join(' ').toLowerCase();
  }

  function setupSearch() {
    all('[data-search-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-search-input]');
      var cards = all('.searchable-card', scope);
      var empty = scope.querySelector('[data-no-result]');
      if (!input || !cards.length) {
        return;
      }

      function apply() {
        var keyword = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var ok = !keyword || cardText(card).indexOf(keyword) !== -1;
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      input.addEventListener('input', apply);
      apply();
    });
  }

  function setupFilters() {
    all('[data-filter-scope]').forEach(function (scope) {
      var chips = all('[data-filter]', scope);
      var cards = all('.searchable-card', scope);
      if (!chips.length || !cards.length) {
        return;
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var value = chip.getAttribute('data-filter');
          chips.forEach(function (item) {
            item.classList.toggle('active', item === chip);
          });
          cards.forEach(function (card) {
            var text = cardText(card);
            var ok = value === 'all' || text.indexOf(value.toLowerCase()) !== -1;
            card.style.display = ok ? '' : 'none';
          });
        });
      });
    });
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.querySelector('[data-movie-video]');
    var cover = document.querySelector('[data-player-cover]');
    if (!video || !streamUrl) {
      return;
    }

    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        return;
      }

      video.src = streamUrl;
    }

    function start() {
      attach();
      video.controls = true;
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupHeader();
    setupMenu();
    setupHero();
    setupSearch();
    setupFilters();
  });
}());
