const CACHE_NAME = "image-cache-v2";
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

// Helper: cek apakah URL termasuk file gambar
function isImageRequest(url) {
    try {
        const { pathname } = new URL(url);
        return IMAGE_EXTENSIONS.some((ext) =>
            pathname.toLowerCase().endsWith(ext)
        );
    } catch {
        return false;
    }
}

self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Hanya proses permintaan GET dan file gambar
    if (request.method !== "GET" || !isImageRequest(request.url)) return;

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                // 🧠 Return dari cache dulu (lebih cepat)
                return cachedResponse;
            }

            try {
                // 🌐 Fetch dari network dan simpan ke cache
                const networkResponse = await fetch(request, { mode: "cors" });
                if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            } catch (error) {
                // 🚫 Jika offline / fetch gagal
                console.warn("SW fetch failed:", error);
                return cachedResponse || Response.error();
            }
        })
    );
});

// 🔁 Optional: Clear cache lama saat update service worker
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key))
                )
            )
    );
});
