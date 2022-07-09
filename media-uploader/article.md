# Create a media uploader in React Native

There are a number of tools used to build mobile apps like Android Studio and XCode and usually you need a different programming language, like C# or Swift. If you're a web developer that's ever wanted to dabble in mobile app development, this can be a deterrent. Thankfully there are a number of tools that let us use familiar code to make native mobile apps.

In this post, we're going to make a simple image uploader app with a couple of screens using [React Native](https://reactnative.dev/). One screen will have the uploader and the other will display images we've added. All of the images will be stored in Cloudinary, so if you don't have a [free account](https://cloudinary.com/users/register/free), now is a good time to make one.

## Set up the development environment

Let's start by setting up the development environment because this is typically more involved than with web apps. Luckily for us, there is a CLI tool we can use to get our mobile development environment up and running really fast. We're going to use the [Expo CLI](https://docs.expo.dev/workflow/expo-cli/). It does a lot of cool things, but we're going to limit our scope to our React Native app.

Run this command in your terminal to install the CLI tool.

```bash
$ npm install -g expo-cli
```

Now we can create a new React Native app with the following command.

```bash
$ expo init media-uploader
```

There will be a prompt in your terminal to select the template you want to get started with. Choose the `tabs` template because it'll have a lot of boilerplate that we can work with. Also, make sure it's the TypeScript version so that we can add typing as we build this app.

There's just one package we need to install so that we can add the image picker for something in a user's gallery or an image they take with the camera. In the `media-uploader` directory, run this.

```bash
$ yarn add react-native-image-picker
```

Now you can navigate inside of the new `media-uploader` folder and see all of the code we're working with. You can run the app now with `yarn web` to check it out in the browser before you download emulators or check the app on your phone. This command also generates a QR code you can scan with your phone to view the app.

Since everything is working, we can dive into the first screen of the app and create the upload component.

## Make the upload screen

We can work with some of the boilerplate code here and just update the files we need. So open `screens > TabOneScreen.tsx`.

## Make the viewer screen

Now we just have one more screen to make so that users can view the images they've uploaded. We're going to build this screen using `screens > TabTwoScreen.tsx`.

## Finished code

You can check out all of the code in the `media-uploader` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/media-uploader). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/blissful-tdd-f6etdd).

<CodeSandBox
  title="blissful-tdd-f6etdd"
  id="blissful-tdd-f6etdd"
/>

## Conclusion

Mobile apps aren't going anywhere and if you already know React, this is a great way to expand your professional toolbox. By learning some principles of mobile development and jumping into tools like this, you'll be able to work on React Native apps for Android and iOS while being able to test them out in the browser!
