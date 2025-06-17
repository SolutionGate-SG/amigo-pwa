import { precacheAndRoute } from 'workbox-precaching';
     import { registerRoute } from 'workbox-routing';
     import { NetworkFirst } from 'workbox-strategies';

     declare const self: ServiceWorkerGlobalScope;

     // Define type for Workbox manifest
     interface PrecacheEntry {
       url: string;
       revision?: string;
     }

     precacheAndRoute(self.__WB_MANIFEST as PrecacheEntry[]);

     registerRoute(
       ({ url }) => url.pathname.startsWith('/api/'),
       new NetworkFirst()
     );

     registerRoute(
       ({ url }) => url.pathname.startsWith('/product/'),
       new NetworkFirst()
     );