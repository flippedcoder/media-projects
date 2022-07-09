# Build an Image Library Using Web Components

Every front-end developer knows about at least one of the popular frameworks like React, Vue, Angular, and Next. They probably know about a few more as well. These frameworks are great for most applications, but there are a few cases you might not want to use them.

You might need to build an app around performance and don't want the overhead of a framework or you want to build a framework-agnostic component library. The second case is usually the most common. That's why we're going to build a simple image library with web components to upload and display images we host in Cloudinary to show off how this can work.

## What are Web Components

Web components are a set of APIs that let you create custom HTML tags to use in your web apps. It's basically a way for you to build the same functionality you can in a framework, without one. It works with the shadow DOM so you can build hidden DOM trees and only show them when you want. This lets you build things in the background before they get rendered.

It uses HTML template elements to define the components and you can still use ES modules in your implementation. You don't _need_ a library to work with it because you can build web components with pure HTML and JavaScript, but it does help to have at least a simple library to get things running.

## Initialize the Lit app

We do need to set up the folder for the project. So create a new folder called `image-library` and run the following command.

```bash
$ npm i
```

This will take you through a few questions in the terminal that you can feel free to hit "Enter" all the way through. Now we need to install the [Lit](https://lit.dev/) library to work with web components and build this little app.

```bash
$ npm i lit
```

Just to see how much smaller this library is compared to the frameworks we're working to replace, take a look in the `node_modules` and see how small it is. This is a huge reason that web components are still used and considered. That and they can be used in any of the frameworks if you need to!

You'll also need a free Cloudinary account to host all of your pictures for this app. So if you don't have one, go sign up [here](https://cloudinary.com/users/register/free). You'll need the `cloud name` and `upload preset` values from your console so we can upload images. Go ahead and make a `.env` file at the root of your project. It'll look something like this:

```bash
CLOUDINARY_UPLOAD_PRESET=cwp7qiwn
CLOUDINARY_CLOUD_NAME=fjiweegg
```

### Set up the tsconfig

We're going to be using TypeScript throughout this app, so we want to have the configs properly set. Create a new file called `tsconfig.json` in the root of the project and add the following code.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

This should be all you need for the app to run, but feel free to update this with your favorite rules. Now that everything is set up, let's continue onto the upload component.

## Make the upload component

While there is an [SDK](https://cloudinary.com/documentation/upload_widget) that makes this component for us, we can also write a custom upload widget using a web component to have more control over styles and handling requests. In the `image-library` folder, add a new folder called `components`. In that folder, add a new file called `upload-widget.ts`.

This is where we'll define the web component. In this file, add the following code.

```typescript
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

async function uploadReq(e: any) {
  const uploadApi = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

  const dataUrl = e.target.value;

  const formData = new FormData();

  formData.append("file", dataUrl);
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);

  await fetch(uploadApi, {
    method: "POST",
    body: formData,
  });
}

@customElement("upload-widget")
export class UploadWidget extends LitElement {
  static styles = css`
    button {
      font-size: 18px;
      padding: 2px 5px;
    }
  `;

  render() {
    return html`
      <form onSubmit=${(e: any) => uploadReq(e)}>
        <label htmlFor="imageUploader">Upload an image here</label>
        <input name="imageUploader" type="file" />
        <button type="submit">Add image</button>
      </form>
    `;
  }
}
```

Let's go through what's happening in the code here. First, we import a few packages. Next, we define a function called `uploadReq`. This will take an uploaded file and send it to our Cloudinary account. You'll need the credentials for your account to make the POST request work and you can get those from the Cloudinary dashboard.

After the `uploadReq` function, we start defining the component. We use the `@customElement` decorator so that our app will know that this is a custom HTML element called `upload-widget`. Then we define some styles for the widget. Lastly, we build the form that will be rendered when this web component is added to the screen. This form lets users upload any image file they want and it will trigger a POST request to Cloudinary.

## Create the image library

Now we need to get all of the images from Cloudinary that we want to show in our library. You'll need a couple more credentials, so go back to your dashboard and get an API key and the corresponding API secret and add those to your `.env` file. So your file should look like this:

```bash
# .env
CLOUDINARY_UPLOAD_PRESET=cwp7qiwn
CLOUDINARY_CLOUD_NAME=fnoiqrio
CLOUDINARY_API_KEY=49846468468868
CLOUDINARY_API_SECRET=_8qe84fed8gv4tggwr659
```

Now add a new file to the `components` folder called `library-display.ts`. Add the following code to the file:

```javascript
// library-display.ts
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

interface Image {
  title: string;
  url: string;
}

@customElement("library-display")
export class LibraryDisplay extends LitElement {
  static styles = css`
    .container {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .image-card {
      padding: 8px;
      width: 250px;
    }
  `;

  images: Image[] = [
    {
      title: "dogs",
      url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1606580778/3dogs.jpg`,
    },
    {
      title: "dogs",
      url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1606580778/3dogs.jpg`,
    },
  ];

  async fetchImages() {
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

    const allImgs: Image[] = resources.map((resource) => ({
      url: resource.secure_url,
      title: resource.public_id,
    }));

    this.images = allImgs;
  }

  render() {
    this.fetchImages();
    return html`
      <div class="container">
        ${this.images.length > 0
          ? this.images.map(
              (image) =>
                html`
                  <img
                    class="image-card"
                    src="${image.url}"
                    alt="${image.title}"
                  />
                `
            )
          : html` <div>No images</div> `}
      </div>
    `;
  }
}
```

We start this component off with some imports and a type definition. Then we create a new custom `library-display` component. Next we add some styles and then we seed a few images. Make sure you update the image files to something in your own Cloudinary account!

Then we define the `fetchImages` method which will retrieve all of the images we upload to Cloudinary and update the `images` array we have in the component. Finally, we call the `render` function which is where we call `fetchImages` and then create all of the HTML elements to display the images. That's all for this component. Now we need to update the `index.html` file to use these custom web components.

## Use the web components

Open the `index.html` file, delete any existing code and add the following:

```html
<!-- index.html -->
<html>
  <head>
    <title>This library though</title>
    <script type="module" src="./upload-widget.ts"></script>
    <script type="module" src="./library-display.ts"></script>
  </head>
  <body>
    <upload-widget></upload-widget>
    <library-display></library-display>
  </body>
</html>
```

We import the components in the `<head>` and then use them in the `<body>`. That's all we need to display these to users! So you've written a couple of custom web components to handle this whole library for you.

![finished app](https://res.cloudinary.com/mediadevs/image/upload/v1656086890/e-603fc55d218a650069f5228b/hownm0rmetxqixswcfhg.png)

## Finished code

You can check out the complete code for this project in the [`image-library` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/image-library). You can also check it out in [this Code Sandbox](https://codesandbox.io/s/headless-lake-xgmtfy).

<CodeSandBox
  title="headless-lake-xgmtfy"
  id="headless-lake-xgmtfy"
/>

## Conclusion

Now that you've seen what it's like to work with web components using Lit, maybe you can convince your team to stray away from those big frameworks. Depending on the type of application, it can be easier to make up your own internal framework as you build.
