# Cache images in React

If you've ever noticed a page kind of jump around when images start to render? This is a common user experience issue many apps have a hard time dealing with. When working with React apps, there are a number of approaches you can take to make this experience better for users.

In this post, we're going to cover a couple of ways you can cache and load images in fast, user friendly ways. By the time you get to the end, you'll have some approaches you can take back to work with you to add to new image features that come through. Let's start by building a new React app.

## Initial project setup

In a terminal, run the following command to make a new TypeScript React app.

```bash
npx create-react-app caching --template typescript
```

This will bootstrap a new app for us. We're going to pull images from Cloudinary, so if you don't already have an account you can make one for [free here](https://cloudinary.com/users/register/free). Upload a few pictures and make sure to grab your `cloud name`, `API key`, and `API secret` from the Cloudinary dashboard.

Now in the root of your project, make a new file called `.env` and add your Cloudinary credentials to it. This is a common best practice to ensure that your credentials are kept on the server-side. The file will look similar to this.

```.env
CLOUDINARY_API_KEY=23949062490
CLOUDINARY_API_SECRET=nfi2o3gni0or3weg3ni
CLOUDINARY_CLOUD_NAME=nokgwp
```

As part of the project setup, we're going to make a little proxy to handle the request we need to make to Cloudinary to retrieve the images we're going to cache. The reason we need a proxy is because the Cloudinary API requires our `API secret` to authorize any requests we make. This kind of call can't be made on the client-side because our secret would be available to anyone.

## Cloudinary API proxy

This is going to be a quick Express app, so there are a few packages we need to install.

```bash
npm i express cors axios
```

Now in the root of your project, make a new file called `proxy.js` and add the following code.

```javascript
// proxy.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3008;

app.use(cors());

app.get('/images', async (req, res) => {
    const results = await axios.get(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.CLOUDINARY_API_KEY +
          ":" +
          process.env.CLOUDINARY_API_SECRET
        ).toString("base64")}`,
        },
      }
    ).then((response) => {
        const { resources } = response.data;

        const allImgs = resources.map((resource) => ({
            url: resource.secure_url,
            title: resource.public_id,
        }));
    
        res.json({images: allImgs});
    });
});

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`);
});
```

In this file, we import a few packages and set up the Express app with CORS enabled. Then we add a GET endpoint that will be used by our front-end. Inside of this endpoint, we make a request to the Cloudinary API with our credentials. Once the response returns successfully, we extract the data we need as the `allImgs` array and send that as the response to the GET request. Finally, we call the `listen` method and run the Express app on the specified `port`.

There isn't anymore back-end work since this proxy is finished, so let's turn our attention to the front-end where the caching will happen.

## Build the front-end

Let's start by installing one more package to our project to help with caching. Open a terminal and run this command.

```bash
npm i swr
```

This package has the first layer of caching we'll look at. Now go ahead and open `src > App.tsx`. We're going to delete all of the code out of this file and replace it with the following.

```javascript
// App.tsx

import { Suspense } from "react";
import useSWR from "swr";
import { registerCache } from "./service-worker";

const ImageLayout = ({
  images,
}: {
  images: { title: string; url: string }[];
}) => (
  <div>
    {images.map((image) => (
      <>
        <p>{image.title}</p>
        <img src={image.url} alt={image.title} height="150" width="150" />
      </>
    ))}
  </div>
);

function App() {
  const baseURL = "http://localhost:3008";

  const fetcher = (url: string) =>
    fetch(url).then(async (res) => await res.json());

  const { data, error } = useSWR(`${baseURL}/images`, fetcher);

  if (error) return <h1>Something went wrong!</h1>;
  if (!data) return <h1>Loading...</h1>;

  useEffect(() => {
    registerCache();
  }, []);

  return (
    <div>
      <Suspense fallback={<p>Loading user images...</p>}>
        <ImageLayout images={data.images} />
      </Suspense>
    </div>
  );
}

export default App;
```

First, we import some of the things we from packages and then we jump straight into the `ImageLayout` component.  Since the primary focus is on caching, this component doesn't have to be very complex. It's just a way to render the images we fetch from the Cloudinary proxy. It takes the images array as a prop and then maps over it to render all of our images.

Next, we make the `App` component. Let's walk through some of the things we're doing to help with caching images.

### useSWR

This is a package that uses a React hook to handle caching and it's built on top of `Suspense`, which we'll discuss in a moment. We're using the `useSWR` hook to make the request to our proxy and return the images in the `data` value or return any issues to the `error` value. This hook operates based on the `stale-while-revalidate` cache invalidation strategy.

So `useSWR` first returns data from the cache if it's available, _then_ it sends a request to the proxy, and then it returns the freshest data. This allows the initial page load to be really fast for the user and we can use messaging to let them know when the data is loading or if something goes wrong.

This is the first way we handle caching the images. `useSWR` will always check the cache for this response first now that a request has been made to the `/images` endpoint. You can see this in the `Application` tab of your developer tools. In the app, you can see we have a few checks we do before rendering the images.

These are best practices to make sure the user experience is good. If there's an issue with the API request, we need to let the user know something went wrong and if the data is still loading we need to let them know. This helps prevent them from making multiple requests because they can't tell what's happening.

### Suspense

The next thing we do is use the `Suspense` component built into the React framework. This doesn't do any caching, but it also helps smooth the user experience while data is loading. This is here as an example of lazy loading images, which can also improve app performance similar to how caching does. Since we're using `useSWR` and handling the load state ealier, we don't have to implement the `Suspense` component. This is just to give you another tool for performant image loading.

That's all we're doing in the app itself. The main piece of caching here is using the `useSWR` hook which handles a lot for us. The other way to approach more custom caching is with a service worker.

## Service workers

Service workers are very tricky to set up and test because you have to constantly monitor where you responses are coming from and if a request was actually ever made. Unless your app is fetching hundreds of fields of data from multiple endpoints regularly, `useSWR` will likely give you adequate coverage.

If you want something more robust, let's take a look at implementing a service worker that caches our proxy endpoint. You may have noticed that we imported a `registerCache` function and called it in the `useEffect` hook in our app. In the `src` directory, create a new file called `service-worker.js` and add the following code.

```javascript
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
  const baseURL = "http://localhost:3008"
  
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
```

This is when we get into the depths of using [Workbox](https://developer.chrome.com/docs/workbox/). There's _a lot_ to cover with different caching strategies, but you can we're using the `StaleWhileRevalidate` strategy for the `/images` endpoint just like with `useSWR`. This is a different way to implement that.

We're also implementing the `NetworkFirst` caching strategy on any other endpoints we might add to the proxy. This strategy will make a network request first and save the response to the cache. Then if you're offline later, it will fallback to the cached response when the network request fails. You can mix a number of caching strategies in your service worker to customize how requests and responses should be handled.

## Finished code

You can check out the complete code in the [`caching` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/caching) or this Code Sandbox(<https://codesandbox.io/s/old-waterfall-0bzc6y>)

<CodeSandBox
  title="old-waterfall-0bzc6y"
  id="old-waterfall-0bzc6y"
/>

## Conclusion

These are just some of the approaches you can take to work with caching your images. You might even look into using a CDN like we did with Cloudinary. The purpose of caching any data is to make your app faster and more reliable for your users. They don't have to wonder what happened when the page jumps randomly and they don't have to wait a long time for data to do that initial load.
