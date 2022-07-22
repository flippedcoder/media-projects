// @ts-nocheck
import { setCacheNameDetails } from 'workbox-core'
import {
  precacheAndRoute,
  PrecacheController,
  createHandlerBoundToURL
} from 'workbox-precaching'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst
} from 'workbox-strategies'
import { version } from '../package.json'

/* eslint-disable */
const baseURL = process.env.REACT_APP_API

// Caching duration of the items, one hour here
const CACHING_DURATION = 3600

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', (event) =>
  event.waitUntil(self.clients.claim())
)

precacheAndRoute(self.__WB_MANIFEST)

setCacheNameDetails({
  prefix: 'dashboard',
  suffix: version,
  precache: 'it',
  runtime: 'rt',
  googleAnalytics: 'ga'
})

// Metrics requests can be safely cached until the values are stale
registerRoute(
  new RegExp(`${baseURL}.*metrics.*`),
  new StaleWhileRevalidate({
    cacheName: 'metricsResponse',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: CACHING_DURATION
      })
    ]
  })
)

// Register SWR for all other API requests
registerRoute(
  new RegExp(`^(?!.*(generate_signature|settings)).*v1.*sites.*`),
  new NetworkFirst({
    cacheName: 'otherRoutesResponse',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: CACHING_DURATION
      })
    ]
  })
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
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

self.addEventListener('message', async (msg) => {
  try {
    // Upon registration, our application sends the user's JWT via post message
    const { token, revision } = msg.data
    const prefetchRoutes = [
      { url: '/sites?query=', revision: revision },
      { url: `/features/users/${userId}`, revision: revision },
      { url: '/sites', revision: revision },
      { url: '/sites/light_search/', revision: revision },
      { url: '/optouts/', revision: revision },
      { url: '/categories/', revision: revision }
      // { url: '/psas/', revision: null }
    ]

    // Generate a plugin to pass to the precache controller with Authorization headers
    const customHeaders = {
      requestWillFetch: async ({ request }) => {
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${token}`)
        return new Request(request.url, { headers: headers })
      }
    }

    const precacheController = new PrecacheController()

    // Generate a list of URLs to cache and register them with the precache controller
    precacheController.addToCacheList(
      prefetchRoutes.map((r) => `${baseURL}${r.url}`)
    )

    // Install and execute the precache
    await precacheController.install({ plugins: [customHeaders] })
    await precacheController.activate()
  } catch (err) {
    console.log(err)
  }
})