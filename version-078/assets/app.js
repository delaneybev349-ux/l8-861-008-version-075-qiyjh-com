(function () {
  function byData(name) {
    return document.querySelector("[" + name + "]");
  }

  function allByData(name) {
    return Array.prototype.slice.call(document.querySelectorAll("[" + name + "]"));
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().trim();
  }

  function initMenu() {
    var toggle = byData("data-menu-toggle");
    var nav = byData("data-mobile-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = byData("data-hero");
    if (!hero) {
      return;
    }
    var slides = allByData("data-hero-slide");
    var dots = allByData("data-hero-dot");
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide-index")) || 0);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function initFilters() {
    var input = byData("data-filter-input");
    var typeSelect = byData("data-type-filter");
    var yearSelect = byData("data-year-filter");
    var cards = allByData("data-video-card");
    if (!cards.length || (!input && !typeSelect && !yearSelect)) {
      return;
    }
    function matches(card) {
      var query = normalize(input ? input.value : "");
      var type = normalize(typeSelect ? typeSelect.value : "");
      var year = normalize(yearSelect ? yearSelect.value : "");
      var text = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" "));
      var typeOk = !type || normalize(card.getAttribute("data-type")).indexOf(type) !== -1;
      var yearOk = !year || normalize(card.getAttribute("data-year")) === year;
      var queryOk = !query || text.indexOf(query) !== -1;
      return typeOk && yearOk && queryOk;
    }
    function apply() {
      cards.forEach(function (card) {
        card.classList.toggle("is-hidden", !matches(card));
      });
    }
    [input, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.getElementById("movie-video");
    var overlay = document.getElementById("player-overlay");
    var shell = byData("data-player-shell");
    if (!video || !streamUrl) {
      return;
    }
    var attached = false;
    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }
    function play() {
      attach();
      if (shell) {
        shell.classList.add("is-playing");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }
    attach();
    if (overlay) {
      overlay.addEventListener("click", play);
    }
    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("is-playing");
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
