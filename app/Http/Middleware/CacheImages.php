<?php

namespace App\Http\Middleware;

use Closure;

class CacheImages
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        if ($request->is('storage/*') || $request->is('images/*')) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        }
        return $response;
    }
}
