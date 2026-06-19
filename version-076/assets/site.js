(function () {
  var header = document.querySelector('[data-header]');
  var mobileButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function startSlider() {
      stopSlider();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopSlider() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener('click', function () {
        showSlide(current);
        startSlider();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startSlider();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startSlider();
      });
    }

    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
    showSlide(0);
    startSlider();
  }

  var searchForms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input) {
        return;
      }
      var value = input.value.trim();
      if (value) {
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(value);
      }
    });
  });

  var filterInput = document.querySelector('[data-filter-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';

  function applyFilter(value) {
    var query = value.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-filter-card') || '').toLowerCase();
      var matched = !query || haystack.indexOf(query) !== -1;
      card.classList.toggle('hidden-by-filter', !matched);
      if (matched) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (filterInput && cards.length) {
    filterInput.value = initialQuery;
    applyFilter(filterInput.value);
    filterInput.addEventListener('input', function () {
      applyFilter(filterInput.value);
    });
  }
})();
