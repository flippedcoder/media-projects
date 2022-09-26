# Lazy load images in Preact

One big discussion that comes up at the beginnning of any new front-end project is which framework you should use. The top three that usually come up are React, Angular, and Vue. Although, there are many others out there that have been built with particular use cases in mind. That's why we're going to take a look at [Preact](https://preactjs.com/).

It's a super light-weight (3kB!) framework that's very similar to React. We're going to build a simple app with Preact to show how it works. The app will lazy load images for the user so that it stays fast and reactive to data changes. We'll cover a couple of ways to manage an app that handles a number of images being loaded on the page as well.

## Initial setup

Let's start by bootstrapping a new Preact app with the following command.

```bash
npx preact-cli create default lazy-preact-images
```

This will use the Preact CLI to generate some boilerplate code for us to start with. You can run the app now with this command just to see how fast it loads and what the template project looks like.

```bash
npm run dev
```

![the boilerplate app in the browser](https://res.cloudinary.com/mediadevs/image/upload/v1658925592/e-603fc55d218a650069f5228b/eps0gl6gfrlda5a62mat.png)

We'll be fetching the images from Cloudinary, so if you don't already have a free account, [set one up here](https://cloudinary.com/users/register/free). Make sure to upload a few pictures and grab your `cloud name`, `API key`, and `API secret` from the Cloudinary dashboard. You'll need these values for a little proxy we'll make to fetch the images we're lazy loading. We also need to install a few packages to make that proxy. It will be a simple [Express](https://expressjs.com/) app, so run the following command to install the packages:

```bash
npm i axios cors express
```

Now we can go into the code and start making things our own. We'll start by creating the proxy to make the Cloudinary request.

## The Cloudinary proxy

The reason we can't make this request from the client-side is because it would expose the `API secret`. You don't want to do that because it would allow anyone to access your Cloudinary resources which can cause lots of issues. That's why we're spinning up a quick Express app.

In the root of the project, create a new file called `proxy.js`. Add the following code to this file:

```javascript
// proxy.js

const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const port = 3004

app.use(cors())

app.get('/images', async (req, res) => {
    const results = await axios.get(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/image`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.API_KEY +
          ":" +
          process.env.API_SECRET
        ).toString("base64")}`,
      },
    }
    ).then((response) => {
      const { resources } = response.data;

      const allImgs = resources.map((resource) => ({
          url: resource.secure_url,
          title: resource.public_id,
      }));
    
      res.json({images: allImgs})
    });
})

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`)
})
```

We start by importing the packages we need and setting up the Express app to use CORS. Then we set up a GET endpoint to fetch the images. This is where you use Axios to make a request to the Cloudinary API with the credentials you got from the dashboard eearlier.

After that, we handle the promise returned and parse out the data needed from the Cloudinary response. Then we return the modified data as the repsonse to our proxy endpoint. Finally, we run the Express app on the defined port. This wraps up all of the back-end work. Now let's move over to the Preact client-side.

## Load images onto the page

We'll start by updating the home view to load and display images that are served from the back-end or some other service. This is the only view we'll use in this post, but I highly encourage you to check out the other pages and components throughout the app to see more of the differences between Preact and other frameworks. So to get started, go to `src > routes > home` and open the `index.js` file.

You can delete all of the existing code and replace it with the following:

```javascript
import { useState, useEffect } from 'preact/hooks';
import style from './style.css';

const Home = () => {
 const [images, setImages] = useState([])
 const [isFetching, setIsFetching] = useState(false);

 async function fetchPhotos() {
  setTimeout(async () => {
    await fetch("http://localhost:3006/images").then(async (data) => {
        const imageData = (await data.json()).images;
        setImages(imageData);
      })
    }
  , 2000)
 }

 function handleScroll() {
  if (
   Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight || isFetching
  ) return;
  setIsFetching(true);
 }

 useEffect(() => {
  fetchPhotos();
  window.addEventListener('scroll', handleScroll);
 }, [])

 if (images.length === 0) {
  return (
   <div class={ style.home }>
    <h1>Almost there...</h1>
    <div class={ style.skeleton }>Loading images...</div>
   </div>
  )
 }

 return (
  <div class={style.home}>
   <h1>These are the images</h1>
   {images.length !== 0 && images.map(image => (
     <div>
      <p>{image.title}</p>
      <img src={image.url} alt={image.title || "..."} height="150" width="150" />
     </div>
    ))
   }
  </div>
 )
};

export default Home;
```

Let's walk through this code and discuss the parts that are specifically related to lazy loading and good rendering. We start with a few imports and then jump right into the `Home` component. This has a couple of states that store the values for the list of images fetched from the proxy and an `isFetching` value that we'll use to determine how lazy loading should work.

Then we have the `fetchPhotos` function that calls the proxy to get the images from Cloudinary. This is a regular async call that will update the `images` state. The only thing we're doing different here is adding the `setTimeout` to show off how the image loading is handled. This function is called on the initial page load in the `useEffect` hook a bit further down.

### Virtual scroll

Next we have the `handleScroll` function that only loads images that are in the current view. It will check what the current page position is and load images when the `scroll` event listener is triggered. This event listener is added in the `useEffect` hook right after the fetch request. This is our simple implementation of lazy loading.

As a user scrolls down the page, images will only load when the element comes into view. There's one more thing we need to account for with the images rendering. That's the initial load for the elements that _are_ in view.

### Placeholder component

To handle this, we're going to use a placeholder element. When you have API responses that take a while to return, you want to show the user something that lets them know the page hasn't frozen. This will be a UI component that renders while the front-end waits for a response and it won't tie up the thread so that other parts of the page can continue to load.

That's why we check if the `images` state has anything in the array first. If it doesn't we need to return something so that we don't crash the app by trying to access data that doesn't exist yet. Since the `images` state will update when the response returns, a re-render will be triggered that will then display the full page with all of the images ready to lazy load on the screen.

With all of this in place, run the app with the following commands:

```bash
node proxy.js # start the Cloudinary proxy
npm run dev # start the Preact app
```

You should see something like this while the data is in a loading state.

![loading component](https://res.cloudinary.com/mediadevs/image/upload/v1660596939/e-603fc55d218a650069f5228b/gp2lwo0sakcx8ckmqgd9.png)

Once the `images` state has data, you'll see something like this on the page, except with your own images.

![your images on the home page](https://res.cloudinary.com/mediadevs/image/upload/v1660597066/e-603fc55d218a650069f5228b/hgy4azcbliekclfgsoli.png)

And if you scroll down the page, you'll notice images loading as you move.

## Finished code

You can check out all of the code in the `lazy-preact-images` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/lazy-preact-images). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/jovial-zeh-31ovgy).

<CodeSandBox
  title="jovial-zeh-31ovgy"
  id="jovial-zeh-31ovgy"
/>

## Conclusion

In this post, we covered how to handle lazy loading images since this is a common front-end task. We also learned how to do this is Preact instead of React. When you're building a front-end and thinking about which framework to use, remember to check out a few options other than the normal top three. You might find something that is easier to work with or easier to optimize for your app needs.
