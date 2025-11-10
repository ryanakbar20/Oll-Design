import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// import i18n (needs to be bundled ;))
import "./i18n";
const appName = "売れる店を創るデザイン・設計・アドバイス";

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    // title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js");
            });
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
