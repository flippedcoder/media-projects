# Create a media uploader in React Native

There are a number of tools used to build mobile apps like Android Studio and XCode and usually you need a different programming language, like C# or Swift. If you're a web developer that's ever wanted to dabble in mobile app development, this can be a deterrent. Thankfully there are a number of tools that let us use familiar code to make native mobile apps.

In this post, we're going to make a simple image uploader app with a couple of screens using [React Native](https://reactnative.dev/). One screen will have the uploader and the other will display images we've added. All of the images will be stored in Cloudinary, so if you don't have a [free account](https://cloudinary.com/users/register/free), now is a good time to make one.

## Set up the development environment

Let's start by setting up the development environment because this is typically more involved than with web apps. Luckily for us, there is a CLI tool we can use to get our mobile development environment up and running really fast. We're going to use the [Expo CLI](https://docs.expo.dev/workflow/expo-cli/). It does a lot of cool things, but we're going to limit our scope to our React Native app.

Run this command in your terminal to install the CLI tool.

```bash
npm install -g expo-cli
```

Now we can create a new React Native app with the following command.

```bash
expo init media-uploader
```

There will be a prompt in your terminal to select the template you want to get started with. Choose the `tabs` template because it'll have a lot of boilerplate that we can work with. Also, make sure it's the TypeScript version so that we can add typing as we build this app.

There's just one package we need to install so that we can add the image picker for something in a user's gallery or an image they take with the camera. In the `media-uploader` directory, run this.

```bash
yarn add react-native-image-picker
```

Now you can navigate inside of the new `media-uploader` folder and see all of the code we're working with. You can run the app now with `yarn web` to check it out in the browser before you download emulators or check the app on your phone. This command also generates a QR code you can scan with your phone to view the app.

Since you know how the app works now, let's quickly create a proxy to handle the request we need to make to Cloudinary. We're doing this because we can't have our Cloudinary API secret exposed on the client-side in a request.

## Handle fetching images from Cloudinary

The first thing to note is that you will need to set up a back-end to act as a proxy for the request to Cloudinary to get all of the images from your account. To do this, we're going to make a really simple Express app. At the root of the project, add a new file called `proxy.js`. Now run the following command to install the packages we need for this:

```bash
npm i express cors axios
```

Now we can write all of the code that goes in the proxy. Here's what the file will look like when you're finished:

```javascript
// proxy.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3003;

app.use(cors());

app.get('/images', async (req, res) => {
    const results = await axios.get(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        ${API_KEY} +
        ":" +
        ${API_SECRET}
      ).toString("base64")}`,
    },
    }).then((response) => {
      const { resources } = response.data;

      const allImgs = resources.map((resource) => ({
            url: resource.secure_url,
            title: resource.public_id,
        })
      );
    
      res.json({images: allImgs});
    });
})

app.listen(port, () => {
    console.log(`Proxy listening on port ${port}`);
})
```

We start by importing the packages we need then jump into setting up the Express app with CORS enabled. Note that the `port` number here is 3003 and you can change it to any other value you want.

Then we make a simple GET endpoint that handles the request to Cloudinary. The reason we have to do this on the back-end instead of the front-end is because we don't want to expose the value of our `API_SECRET` to the client. It's totally fine to expose the `API_KEY` since this is a public key anyways. This endpoint is going to make a call to Cloudinary with the credentials you have set, parse out the values we need to display the images to users, and return that new array as the response of the endpoint.

The last part of this proxy is running the app on port 3003 with the `listen` method. This will print a little message to the console to let you know the proxy is running. Since this proxy is ready to go, we can dive into the first screen of the app and create the upload component.

## Make the upload screen

We can work with some of the boilerplate code here and just update the files we need. So open `screens > TabOneScreen.tsx`. Delete the existing code and replace it with the following:

```javascript
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import {
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from "react-native-image-picker";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({}: RootTabScreenProps<"TabOne">) {
  const [image, setImage] = useState<any>();

  const pickImage = () => {
    const options = {
      mediaType: "photo" as MediaType,
      quality: 1 as PhotoQuality,
    };

    launchImageLibrary(options, (res) => {
      if (res.errorCode) return;

      if (res.assets) {
        const imageData = {
          dataUri: res.assets[0].base64 || "",
          name: res.assets[0].fileName || "image",
        };

        setImage(imageData);
      }
    });
  };

  const uploadImage = async (image: any) => {
    const dataUrl = image?.dataUri || "";

    const uploadApi = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "cwt1qiwn");

    await fetch(uploadApi, {
      method: "POST",
      body: formData,
    });
  };

  useEffect(() => {
    uploadImage(image);
  }, [image]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an image here</Text>
      <View style={styles.separator} />
      {image && (
        // @ts-ignore
        <Image source="" style={{ width: 300, height: 300 }} />
      )}
      <Button title="Upload Photo" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
```

We start off by importing the packages we'll be working with. Then we make the component called `TabOneScreen` and start filling the functions and the rendered elements. This is where all of the upload functionality will be. We start by declaring a state that captures the info we need to handle the image we're uploading.

Then there's the `pickImage` function that will open the user's gallery on their mobile device so they can select the picture. We have a few `options` for the `launchImageLibrary` function we call and then the callback function parses the info about the image that we need to upload to Cloudinary.

Next, we define the `uploadImage` function that will take the selected image and post it to Cloudinary. You'll need to put in your own values for `CLOUD_NAME` and `UPLOAD_PRESET_VALUE` to connect to your Cloudinary account. This function will make a new `FormData` object that will contain the image data and send the POST request to the API.

After this, we use the `useEffect` hook to call the `uploadImage` function whenever the `image` state changes.

Then, we have the return statement that renders the elements users interact with. This will conditionally show an image if the `image` state has data and it will open the upload element when the button is clicked and calls the `pickImage` function.

Finally, there are a few styles to make things look a little better. This is all we need to handle the uploading part. Now let's turn our attention to the next screen that will display our uploaded images.

## Show images on another screen

Now we just have one more screen to make so that users can view the images they've uploaded. We're going to build this screen using `screens > TabTwoScreen.tsx`. Go ahead and delete all of the boilerplate code out of this file and add the following:

```javascript
import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function TabTwoScreen() {
  const [images, setImages] = useState<any>([]);

  const fetchImages = async () => {
    await fetch("http://localhost:3003/images").then(async (data) => {
      const imageData = (await data.json()).images;
      setImages(imageData);
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {images.length !== 0 ? (
        images.map((image: any) => (
          <Image
            source={{ uri: image.url }}
            key={image.title}
            style={styles.logo}
          />
        ))
      ) : (
        <div></div>
      )}
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  logo: {
    width: 150,
    height: 150,
    margin: "12px",
  },
});
```

We start with some simple imports and then jump into the `TabTwoScreen` component. The first thing we create is a state to hold the `images` we receive from our proxy Cloudinary request. Then we define the `fetchImages` funnction to update the state once values are returned. This function gets called on the initial page load in the `useEffect` hook further down.

Finally, we render all of the images on the screen. You should see something similar to this, but with your own images.

![screen with all images loaded](https://res.cloudinary.com/mediadevs/image/upload/v1660601095/e-603fc55d218a650069f5228b/fhtgajaaniszjq1hrojo.png)

## Finished code

You can check out all of the code in the `media-uploader` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/media-uploader). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/blissful-tdd-f6etdd).

<CodeSandBox
  title="blissful-tdd-f6etdd"
  id="blissful-tdd-f6etdd"
/>

*Note: The image picker will not work on web and is only available with Android or iOS simulation.*

## Conclusion

Mobile apps aren't going anywhere and if you already know React, this is a great way to expand your professional toolbox. By learning some principles of mobile development and jumping into tools like this, you'll be able to work on React Native apps for Android and iOS while being able to test them out in the browser!
