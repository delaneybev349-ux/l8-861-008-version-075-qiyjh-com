(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-hero-thumb]'));
    if (slides.length > 1) {
      var index = 0;
      var timer = null;
      var show = function (next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        thumbs.forEach(function (thumb, i) {
          thumb.classList.toggle('is-active', i === index);
        });
      };
      var start = function () {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      };
      thumbs.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () {
          if (timer) {
            window.clearInterval(timer);
          }
          show(i);
          start();
        });
      });
      show(0);
      start();
    }

    document.querySelectorAll('[data-filter-root]').forEach(function (root) {
      var input = root.querySelector('[data-filter-input]');
      var typeSelect = root.querySelector('[data-filter-type]');
      var yearSelect = root.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));
      var empty = root.querySelector('[data-empty]');
      var apply = function () {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-genre') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-year') || ''
          ].join(' ').toLowerCase();
          var okKeyword = !keyword || text.indexOf(keyword) !== -1;
          var okType = !type || (card.getAttribute('data-type') || '') === type;
          var okYear = !year || (card.getAttribute('data-year') || '').indexOf(year) !== -1;
          var ok = okKeyword && okType && okYear;
          card.style.display = ok ? '' : 'none';
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      };
      [input, typeSelect, yearSelect].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
    });

    document.querySelectorAll('[data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      var button = box.querySelector('[data-play-button]');
      var stream = box.getAttribute('data-stream');
      var attached = false;
      var attach = function () {
        if (!video || !stream || attached) {
          return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      };
      var play = function () {
        attach();
        box.classList.add('is-playing');
        if (video) {
          var promise = video.play();
          if (promise && promise.catch) {
            promise.catch(function () {});
          }
        }
      };
      if (button) {
        button.addEventListener('click', play);
      }
      if (video) {
        video.addEventListener('play', function () {
          box.classList.add('is-playing');
        });
        video.addEventListener('click', function () {
          attach();
        });
      }
    });
  });
})();
