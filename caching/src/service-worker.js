// @ts-nocheck
import { setCacheNameDetails } from 'workbox-core'
import {
  precacheAndRoute,
  createHandlerBoundToURL
} from 'workbox-precaching'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import {
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies'

export function registerCache() {
  const baseURL = process.env.REACT_APP_API
  
  // Caching duration of the items, one hour here
  const CACHING_DURATION = 3600
  
  self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()))
  self.addEventListener('activate', (event) =>
    event.waitUntil(self.clients.claim())
  )
  
  precacheAndRoute(self.__WB_MANIFEST)
  
  setCacheNameDetails({
    prefix: 'proxy',
    suffix: version,
    precache: 'it',
    runtime: 'rt',
    googleAnalytics: 'ga'
  })
  
  registerRoute(
    new RegExp(`${baseURL}/images`),
    new StaleWhileRevalidate({
      cacheName: 'imagesResponse',
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: CACHING_DURATION
        })
      ]
    })
  )
  
  // Register SWR for all other API requests
  registerRoute(
    baseURL,
    new NetworkFirst({
      cacheName: 'otherRoutesResponse',
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: CACHING_DURATION
        })
      ]
    })
  )
  
  const handler = createHandlerBoundToURL('./index.html')
  const navigationRoute = new NavigationRoute(handler)
  registerRoute(navigationRoute)

}
