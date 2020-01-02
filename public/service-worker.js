this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v0').then(function(cache) {
            return cache.addAll([
                '/js/app.js',
            ]);
        })
    );
});