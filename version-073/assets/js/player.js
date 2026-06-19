(function () {
    document.querySelectorAll('[data-player]').forEach(function (box) {
        var video = box.querySelector('video');
        var cover = box.querySelector('.play-cover');
        var started = false;
        var hlsInstance = null;

        function playVideo() {
            if (!video) {
                return;
            }
            if (cover) {
                cover.classList.add('is-hidden');
            }
            if (started) {
                var resume = video.play();
                if (resume && resume.catch) {
                    resume.catch(function () {});
                }
                return;
            }
            started = true;
            var src = video.getAttribute('data-play');
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.load();
                var nativePlay = video.play();
                if (nativePlay && nativePlay.catch) {
                    nativePlay.catch(function () {});
                }
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(video);
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                    var hlsPlay = video.play();
                    if (hlsPlay && hlsPlay.catch) {
                        hlsPlay.catch(function () {});
                    }
                });
                return;
            }
            video.src = src;
            video.load();
            var fallbackPlay = video.play();
            if (fallbackPlay && fallbackPlay.catch) {
                fallbackPlay.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener('click', playVideo);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (!started) {
                    playVideo();
                }
            });
            video.addEventListener('ended', function () {
                if (hlsInstance && hlsInstance.destroy) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                }
            });
        }
    });
}());
