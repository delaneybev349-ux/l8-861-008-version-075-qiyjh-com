(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    function setupMobileMenu() {
        var toggle = document.querySelector('.mobile-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = panel.hasAttribute('hidden');
            if (open) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
            toggle.setAttribute('aria-expanded', String(open));
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dots button'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            slides[index].classList.remove('is-active');
            dots[index].classList.remove('is-active');
            index = (next + slides.length) % slides.length;
            slides[index].classList.add('is-active');
            dots[index].classList.add('is-active');
        }
        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(i);
                start();
            });
        });
        start();
    }

    function setupFilters() {
        var boxes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-box]'));
        boxes.forEach(function (box) {
            var section = box.parentElement;
            var input = box.querySelector('[data-local-search]');
            var buttons = Array.prototype.slice.call(box.querySelectorAll('[data-filter]'));
            var list = section ? section.querySelector('[data-card-list]') : null;
            var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];
            var activeFilter = 'all';
            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchFilter = activeFilter === 'all' || text.indexOf(activeFilter) !== -1;
                    card.classList.toggle('is-hidden-card', !(matchQuery && matchFilter));
                });
            }
            if (input) {
                input.addEventListener('input', apply);
                if (input.hasAttribute('data-query-sync')) {
                    var params = new URLSearchParams(window.location.search);
                    var q = params.get('q');
                    if (q) {
                        input.value = q;
                    }
                }
            }
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    buttons.forEach(function (item) {
                        item.classList.remove('is-active');
                    });
                    button.classList.add('is-active');
                    activeFilter = (button.getAttribute('data-filter') || 'all').toLowerCase();
                    apply();
                });
            });
            apply();
        });
    }

    window.initMoviePlayer = function (options) {
        var video = document.getElementById(options.video);
        var button = document.getElementById(options.button);
        var layer = document.getElementById(options.layer);
        var started = false;
        if (!video || !options.source) {
            return;
        }
        function hideLayer() {
            if (layer) {
                layer.classList.add('is-hidden');
            }
        }
        function playVideo() {
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }
        function begin() {
            if (started) {
                playVideo();
                hideLayer();
                return;
            }
            started = true;
            hideLayer();
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.source;
                video.addEventListener('loadedmetadata', playVideo, { once: true });
                video.load();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls();
                hls.loadSource(options.source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                return;
            }
            video.src = options.source;
            video.load();
            playVideo();
        }
        if (button) {
            button.addEventListener('click', begin);
        }
        if (layer && layer !== button) {
            layer.addEventListener('click', begin);
        }
        video.addEventListener('click', function () {
            if (!started) {
                begin();
            }
        });
    };

    ready(function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupFilters();
    });
})();
