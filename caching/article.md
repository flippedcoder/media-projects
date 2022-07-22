# Cache images in React

If you've ever noticed a page kind of jump around when images start to render? This is a common user experience issue many apps have a hard time dealing with. When working with React apps, there are a number of approaches you can take to make this experience better for users.

In this post, we're going to cover several ways you can cache and load images in fast, user friendly ways. By the time you get to the end, you'll have some approaches you can take back to work with you to add to new image features that come through. Let's start with the `Suspense` functionality.

## Suspense

This became a part of the React framework with the React 18 release.

## useSWR

This is a library that uses a React hook to handle caching and it's built on top of `Suspense`. To use this library, we need to run the following command in our project.

```bash
$ npm install swr
```

## Service workers

## Finished code

You can check out the complete code in the [`caching` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/caching) or this Code Sandbox(https://codesandbox.io/s/old-waterfall-0bzc6y)

<CodeSandBox
  title="old-waterfall-0bzc6y"
  id="old-waterfall-0bzc6y"
/>

## Conclusion

These are just some of the approaches you can take to work with caching your images. You might even look into using a CDN like we did with Cloudinary. The purpose of caching any data is to make your app faster and more reliable for your users. They don't have to wonder what happened when the page jumps randomly and they don't have to wait a long time for data to do that initial load.