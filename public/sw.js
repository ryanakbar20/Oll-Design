const CACHE_NAME = "image-cache-v1";
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

self.addEventListener("fetch", (event) => {
    const url = event.request.url;
    if (IMAGE_EXTENSIONS.some((ext) => url.endsWith(ext))) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) return cachedResponse;

                const networkResponse = await fetch(event.request);
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            })
        );
    }
});
