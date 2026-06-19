(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navButton = $('[data-nav-toggle]');
  var mainNav = $('[data-main-nav]');

  if (navButton && mainNav) {
    navButton.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  $$('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"], input[type="search"]');
      if (!input) {
        return;
      }
      var query = input.value.trim();
      if (!query) {
        event.preventDefault();
        input.focus();
      }
    });
  });

  var hero = $('[data-hero]');
  if (hero) {
    var slides = $$('[data-hero-slide]', hero);
    var tabs = $$('[data-hero-tab]', hero);
    var active = 0;
    var timer = null;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      tabs.forEach(function (tab, tabIndex) {
        tab.classList.toggle('active', tabIndex === active);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var index = Number(tab.getAttribute('data-hero-tab')) || 0;
        showSlide(index);
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    startHero();
  }

  $$('[data-local-filter]').forEach(function (form) {
    var input = form.querySelector('input[type="search"]');
    var list = $('[data-filter-list]');

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : '';
      $$('[data-card]', list || document).forEach(function (card) {
        var content = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        card.style.display = !query || content.indexOf(query) !== -1 ? '' : 'none';
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });

    if (input) {
      input.addEventListener('input', applyFilter);
    }
  });

  var searchResults = $('[data-search-results]');
  if (searchResults && window.MOVIE_DATA) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var title = $('[data-search-title]');
    var source = window.MOVIE_DATA;

    function matchMovie(movie) {
      if (!query) {
        return true;
      }
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.category,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();
      return haystack.indexOf(query.toLowerCase()) !== -1;
    }

    function card(movie) {
      var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return '<article class="movie-card" data-card>' +
        '<a class="poster-link" href="' + movie.href + '" aria-label="' + escapeHtml(movie.title) + '">' +
          '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
          '<span class="poster-badge">HD</span>' +
          '<span class="poster-year">' + escapeHtml(movie.year) + '</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
          '<a class="movie-title" href="' + movie.href + '">' + escapeHtml(movie.title) + '</a>' +
          '<p class="movie-meta">' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.type) + '</p>' +
          '<p class="movie-one-line">' + escapeHtml(movie.oneLine || movie.genre) + '</p>' +
          '<div class="tag-list">' + tags + '</div>' +
          '<div class="card-actions">' +
            '<a class="mini-link" href="' + movie.href + '">立即观看</a>' +
            '<a class="mini-link muted" href="' + movie.categoryHref + '">' + escapeHtml(movie.category) + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    var results = source.filter(matchMovie).slice(0, query ? 240 : 60);
    if (title) {
      title.textContent = query ? '搜索：' + query : '热门推荐';
    }
    searchResults.innerHTML = results.map(card).join('');
  }
})();
