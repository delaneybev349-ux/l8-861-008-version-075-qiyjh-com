(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
    });

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
        var list = document.querySelector('[data-filter-list]');
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
        input.addEventListener('input', function () {
            var keyword = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                card.hidden = keyword && text.indexOf(keyword) === -1;
            });
        });
    });

    var globalSearch = document.querySelector('[data-global-search]');
    var results = document.querySelector('[data-search-results]');

    function movieCard(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '' +
            '<article class="movie-card" data-card>' +
                '<a class="poster-wrap" href="./' + movie.file + '" aria-label="' + escapeHtml(movie.title) + '">' +
                    '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
                    '<span class="poster-shade"></span>' +
                    '<span class="play-dot">▶</span>' +
                '</a>' +
                '<div class="card-body">' +
                    '<div class="card-meta">' +
                        '<span>' + escapeHtml(movie.year) + '</span>' +
                        '<span>' + escapeHtml(movie.type) + '</span>' +
                        '<span>' + escapeHtml(movie.region) + '</span>' +
                    '</div>' +
                    '<h3><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>' +
                    '<p>' + escapeHtml(movie.line) + '</p>' +
                    '<div class="tag-row">' + tags + '</div>' +
                '</div>' +
            '</article>';
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (item) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[item];
        });
    }

    function renderGlobalSearch(keyword) {
        if (!globalSearch || !results || !window.MovieCatalog) {
            return;
        }
        var term = keyword.trim().toLowerCase();
        var matched = window.MovieCatalog.filter(function (movie) {
            return !term || movie.search.indexOf(term) !== -1;
        }).slice(0, 120);
        results.innerHTML = matched.map(movieCard).join('');
    }

    if (globalSearch && results) {
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        globalSearch.value = initial;
        renderGlobalSearch(initial);
        globalSearch.addEventListener('input', function () {
            renderGlobalSearch(globalSearch.value);
        });
    }
}());
