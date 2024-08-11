/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute, Route } from "workbox-routing";

import { StaleWhileRevalidate } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL("/"), { allowlist }));

self.skipWaiting();
clientsClaim();

// Handle images:
const apiRoutes = new Route(
  ({ request }) => {
    return request.url.includes("/api");
  },
  new StaleWhileRevalidate({
    cacheName: "api",
  })
);
registerRoute(apiRoutes);
