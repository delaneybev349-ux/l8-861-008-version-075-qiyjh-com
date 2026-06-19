(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            var isOpen = panel.classList.toggle("open");
            button.setAttribute("aria-expanded", String(isOpen));
        });
    }

    function setupSearch() {
        var inputs = document.querySelectorAll(".movie-search");
        inputs.forEach(function (input) {
            var panel = input.closest(".search-panel");
            var clear = panel ? panel.querySelector(".search-clear") : null;
            var scope = panel ? panel.parentElement : document;
            var items = scope.querySelectorAll(".movie-card, .rank-item");
            function filter() {
                var keyword = input.value.trim().toLowerCase();
                items.forEach(function (item) {
                    var haystack = [
                        item.getAttribute("data-title"),
                        item.getAttribute("data-region"),
                        item.getAttribute("data-genre"),
                        item.getAttribute("data-year"),
                        item.textContent
                    ].join(" ").toLowerCase();
                    item.style.display = haystack.indexOf(keyword) === -1 ? "none" : "";
                });
            }
            input.addEventListener("input", filter);
            if (clear) {
                clear.addEventListener("click", function () {
                    input.value = "";
                    filter();
                    input.focus();
                });
            }
        });
    }

    function setupHero() {
        var slider = document.querySelector(".hero-slider");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === index);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                window.clearInterval(timer);
                show(i);
                start();
            });
        });
        start();
    }

    function setupPlayButtons() {
        var buttons = document.querySelectorAll(".play-now");
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var cover = document.getElementById("movie-play");
                if (cover) {
                    cover.click();
                }
            });
        });
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById("movie-video");
        var cover = document.getElementById("movie-play");
        if (!video || !cover || !source) {
            return;
        }
        var attached = false;
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }
        function play() {
            attach();
            cover.classList.add("is-hidden");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    cover.classList.remove("is-hidden");
                });
            }
        }
        cover.addEventListener("click", play);
        video.addEventListener("play", function () {
            cover.classList.add("is-hidden");
        });
        video.addEventListener("pause", function () {
            if (video.currentTime === 0 || video.ended) {
                cover.classList.remove("is-hidden");
            }
        });
        setupPlayButtons();
    };

    ready(function () {
        setupMenu();
        setupSearch();
        setupHero();
    });
}());
