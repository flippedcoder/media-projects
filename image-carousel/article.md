# Implement an Image Carousel in Svelte

[Svelte](https://svelte.dev/) is another popular JavaScript framework for building front-end apps. It's been around since 2016, similar to Angular, although it has a much smaller community and less packages available. Despite this, there are still thousands of developers that love building apps with Svelte compared to the other frameworks.

That's why we're going to build a common component so that you can easily apply it to your own apps. In this post, we're going to build an image carousel that fetches images from Cloudinary and lets users click through them in our app.

## Set up project

If you don't already have a [free Cloudinary account](https://cloudinary.com/users/register/free), you should go sign up for one at this point so you can pull your own images to work with in the carousel. Now we'll set up a new Svelte app using the following command.

```bash
$ npm init vite image-carousel --template svelte
```

You'll be prompted in your terminal to select a few options. Make sure you select the `svelte` framework and the `svelte-ts` variant. Then you'll need to go to the new `image-carousel` directory and install the dependencies.

```bash
$ cd image-carousel
$ npm i
```

Now that we have the Svelte app bootstrapped, let's dive in and add a new component to the project.

## Create the carousel

Svelte components are build completely different from the other frameworks so the syntax might look weird at first. Instead of making functions and classes like with the other frameworks, you have `.svelte` files that have `<script>`, `<style>`, and regular HTML tags. It's pretty easy to pick up as a framework, especially if you are relatively new to front-end development because it only adds a few extra things to make the components responsive.

Let's add a new file to `src > lib` called `Carousel.svelte`. This will hold all of the logic we need to request our images from Cloudinary and render them on the page with a little transition between images when a user clicks a button. In this new file, add the following code.

```svelte
<!-- Carousel.svelte -->
<script lang="ts">
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  let images = [];

  let currentSlideItem = 0;

  const nextImage = () => {
    currentSlideItem = (currentSlideItem + 1) % images.length;
  };

  const prevImage = () => {
    if (currentSlideItem != 0) {
      currentSlideItem = (currentSlideItem - 1) % images.length;
    } else {
      currentSlideItem = images.length - 1;
    }
  };
</script>

{#if images.length === 0}
  <div>No images to show</div>
{:else}
  <div class="carousel-buttons">
    <button on:click={() => prevImage()}>Previous</button>
    <button on:click={() => nextImage()}>Next</button>
  </div>
  {#each [images[currentSlideItem]] as item (currentSlideItem)}
    <img
      transition:slide
      src={item.url}
      alt={item.description}
      width={400}
      height={300}
    />
  {/each}
{/if}
```

Let's go through what's happening here. The first thing to note is that we're writing all of the TypeScript code in the `<script>` tag. You see that we do our package imports at the top of the tag to get the methods we'll need for the functionality, similar to importing packages at the top of component files in other frameworks.

Next, we create a state variable called `images`. This is what will hold all of the images we fetch from Cloudinary and we'll get to that part a bit later. Then we set another state variable called `currentSlideItem`. This updates the index for the current image every time a user clicks one of the buttons avaliable.

After that, we write a couple of functions to handle users going back and forth between images in the carousel. They update the current image based on the length of the `images` array. Once we're outside of the `<script>` tag, then you can see some conditional logic.

This is the way you write conditions in Svelte. There is `if-else-if` notation and the other basic conditional statements. The big thing to pay attention to is that there are open and closing tags for the `{#if}` statement. Make sure you don't miss that closing tag!

Inside the `{:else}` statement, you'll see more conditional rendering. In this case, we're looping through the `images` array to display the images as users click through them. Only the current image is shown, but the rest are there, waiting for their turn.

With the main parts of this component in place, we need to add the call to our Cloudinary account to display the images.

### Make the fetch request

We'll need to make an async call to the Cloudinary API when the component is loaded so that we have the expected images. This will tap into the Svelte component lifecycle because we'll need to use the `onMount` method so this call doesn't get stuck in a bad state. So inside the `<script>` tag, just below the `images` state variable, add the following code.

```svelte
<!-- Carousel.svelte -->
...
  let images = [];

  onMount(async () => {
    const results = await fetch(
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
    ).then((r) => r.json());

    const { resources } = results;

    images = resources.map((resource) => ({
      url: resource.secure_url,
      description: resource.public_id,
    }));
  });
...
```

The request inside the `onMount` function is going to need your Cloudinary API credentials and you can get those from your Cloudinary settings. The request we're making will use your credentials to retrieve all of the images on your Cloudinary account. If you want to limit what gets returned, check out the [API docs](https://cloudinary.com/documentation/search_api).

Now we're getting images directly from the API when the component loads for the first time. All we need to do now is display this new component to users!

## Display the carousel

To do this, we need to make some changes to `App.svelte`. This has quite a bit of boilerplate code, so you can delete everything out of this file. Then replace it with the following code.

```svelte
<!-- App.svelte -->
<script lang="ts">
  import Carousel from "./lib/Carousel.svelte";
</script>

<main>
  <h1>Hello People!</h1>

  <Carousel />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }
  }
</style>
```

This imports our `Carousel` component and renders it on the page with a little message. A big difference between `App.svelte` and `Carousel.svelte` is that we have some styles defined in the `<style>` tag. You can almost think of these style tags like [styled components](https://styled-components.com/) if you've ever worked with that package.

Now if you run the app with `npm run dev`, you should see something like this.

![svelte image carousel](https://res.cloudinary.com/mediadevs/image/upload/v1656969126/e-603fc55d218a650069f5228b/r5xlcltsjxwskryhmxml.png)

That's it! Now you've made a commonly used component in a completely new framework. Take a minute and think about the differences and similarities between this and the framework you normally work with just to see how well you understand them both.

## Finished code

You can check out all of the code in the `image-carousel` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/image-carousel). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/pedantic-shamir-l8py0b).

<CodeSandBox
  title="pedantic-shamir-l8py0b"
  id="pedantic-shamir-l8py0b"
/>

## Conclusion

It's nice to try out different frameworks to see what they do different and see where you can take some pieces from one and apply them to others. Svelte is doing great as a tool developers like to use, so maybe one day we'll see more companies using it to build their apps. Plus it's good to know there's a framework out there that doesn't use the virtual DOM.
