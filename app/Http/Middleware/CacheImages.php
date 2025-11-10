<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CacheImages
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Daftar path atau ekstensi file yang ingin di-cache
        $path = $request->path();
        $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'ico'];

        // Jika file berada di /storage/, /images/, atau /assets/
        // dan punya ekstensi gambar, aktifkan cache
        if (
            preg_match('/^(storage|images|assets)\//', $path) &&
            preg_match('/\.(' . implode('|', $extensions) . ')$/i', $path)
        ) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
            $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
        }

        return $response;
    }
}
