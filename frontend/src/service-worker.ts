import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

interface PrecacheEntry {
  url: string;
  revision?: string;
}

precacheAndRoute(self.__WB_MANIFEST as PrecacheEntry[]);

registerRoute(
  ({ url }) => url.pathname.startsWith('/product/') || url.pathname.startsWith('/vendor/') || url.pathname.startsWith('/wishlist') || url.pathname.startsWith('/search'),
  new NetworkFirst()
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/images/'),
  new StaleWhileRevalidate()
);

// Cache manifest and icons
registerRoute(
  ({ url }) => url.pathname === '/manifest.json' || url.pathname.startsWith('/images/icon-'),
  new StaleWhileRevalidate()
);