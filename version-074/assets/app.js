(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector('.nav-toggle');
        var links = document.querySelector('.nav-links');
        if (toggle && links) {
            toggle.addEventListener('click', function () {
                var open = links.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        if (slides.length) {
            var current = 0;
            var showSlide = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === current);
                });
            };
            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    showSlide(Number(dot.getAttribute('data-slide') || 0));
                });
            });
            window.setInterval(function () {
                showSlide(current + 1);
            }, 6200);
        }

        Array.prototype.slice.call(document.querySelectorAll('[data-movie-search]')).forEach(function (input) {
            var selector = input.getAttribute('data-target');
            var target = selector ? document.querySelector(selector) : document;
            if (!target) {
                return;
            }
            var cards = Array.prototype.slice.call(target.querySelectorAll('.movie-card'));
            var filter = function () {
                var q = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    card.hidden = q.length > 0 && text.indexOf(q) === -1;
                });
            };
            input.addEventListener('input', filter);
        });

        Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('.player-start');
            var mediaUrl = shell.getAttribute('data-video-url') || '';
            var hlsInstance = null;
            var bound = false;
            var attach = function () {
                if (!video || !mediaUrl || bound) {
                    return;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = mediaUrl;
                    bound = true;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hlsInstance.loadSource(mediaUrl);
                    hlsInstance.attachMedia(video);
                    bound = true;
                    return;
                }
                video.src = mediaUrl;
                bound = true;
            };
            var start = function () {
                attach();
                shell.classList.add('is-started');
                var result = video.play();
                if (result && typeof result.catch === 'function') {
                    result.catch(function () {
                        shell.classList.remove('is-started');
                    });
                }
            };
            if (button && video) {
                button.addEventListener('click', start);
                video.addEventListener('click', function () {
                    if (video.paused) {
                        start();
                    }
                });
                video.addEventListener('play', function () {
                    shell.classList.add('is-started');
                });
                video.addEventListener('pause', function () {
                    if (!video.currentTime) {
                        shell.classList.remove('is-started');
                    }
                });
            }
        });
    });
}());
