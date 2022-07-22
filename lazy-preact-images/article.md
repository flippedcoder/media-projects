# Lazy load images in Preact

One big discussion that comes up at the beginnning of any new front-end project is which framework you should use. The top three that usually come up are React, Angular, and Vue. Although, there are many others out there that have been built with particular use cases in mind. That's why we're going to take a look at [Preact](https://preactjs.com/).

It's a super light-weight framework that's very similar to React. We're going to build a simple app with Preact to show how it works. The app will lazy load images for the user so that it stays fast and reactive to data changes. We'll cover a couple of ways to manage an app that handles a number of images being loaded on the page.

## Initial setup

Let's start by bootstrapping a new Preact app with the following command.

```bash
$ npx preact-cli create default lazy-preact-images
```

This will use the Preact CLI to generate some boilerplate code for us to start with. You can run the app now with this command just to see how fast it loads and what the template project looks like.

```bash
$ npm run dev
```

![the boilerplate app in the browser]()

Now we can go into the code and start making things our own. We'll start by updating the home view to load and display images that are served from the back-end or some other service.

## Load images onto the page

We'll only be working with the home view for this post, but I highly encourage you to check out the other pages and components throughout the app to see more of the differences between Preact and other frameworks. So to get started, go to `src > routes > home` and open the `index.js` file. Let's add a function that will execute a fetch request for our images.

```javascript

```

## Skeleton components

## Virtual scroll

## Finished code

You can check out all of the code in the `lazy-preact-images` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/lazy-preact-images). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/).

<CodeSandBox
  title=""
  id=""
/>

## Conclusion

In this post, we covered how to handle lazy loading images since this is a common front-end task. We also learned how to do this is Preact instead of React. When you're building a front-end and thinking about which framework to use, remember to check out a few options other than the normal top three. You might find something that is easier to work with or easier to optimize for your app needs.