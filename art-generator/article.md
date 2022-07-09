# Generate Custom Art with React

Art is one of the ways you can express yourself freely. As someone working in tech, it might be hard to find the time to take up painting or drawing when you're trying to constantly stay on top of all the new tools coming out. Luckily for us, there are some creative ways to combine tech and art to make expressive visuals through data visualization.

In this tutorial, we're going to make a React app to generate custom artwork with the [d3.js](https://d3js.org/) and changing data. This will help us learn more about an advanced JavaScript topic, play with a new library, and make some art in the process.

## Set up the React app

Let's start by creating a brand new React TypeScript app with the following command:

```bash
$ npx create-react-app art-generator --template typescript
```

Since we used `npx` to create the app, we'll be working with `npm` commands throughout the rest of the project instead of `yarn`. If you do prefer `yarn`, you can create the app with `yarn create-react-app art-generator --template typescript`.

With all of the files and folders in place for the React app, we can install the packages we need.

```bash
$ npm i d3 @types/d3 html-to-image
```

We're getting the `d3` library installed so we can make the art based on some data we get from the user and we're using `html-to-image` to save that art to Cloudinary. If you don't have a Cloudinary account, you can [sign up for a free one here](https://cloudinary.com/users/register/free). You'll need your cloud name and upload preset from your account settings in order to make the API call to upload the art images.

Now that everything is set up and we have the credentials we need to upload images, we can start working on a new component to get some user input to create the images.

## Add the generated art component

The first thing we need to do is create a new folder in the `src` folder called `components`. Inside the `components` folder, add a new file called `Art.tsx`. This is where we will write all of the code for this art functionality. To make sure that this component is rendered, we're going to update the `App.tsx` file to import this component we are going to make in a bit.

So open your `App.tsx` file and edit it to look like this:

```js
// App.tsx

import Art from "./components/Art";

function App() {
  return <Art />;
}

export default App;
```

It trims down a lot of the boilerplate code and imports to the exact thing we need. If you try running the app now, you'll get an error because we haven't made the `Art` component yet. That's what we are about to make.

### The art component

Open the `Art.tsx` file and add the following imports.

```js
// Art.tsx

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import * as d3 from "d3";
```

This is all we're going to need to create the artwork from user input. Next, we need to define the type for the user input data since we're building a TypeScript app. Beneath the import statements, add this type declaration.

```js
// Art.tsx
...

type ConfigDataType = {
  color: string,
  svgHeight: number,
  svgWidth: number,
  xMultiplier: number,
  yMultiplier: number,
  othWidth: number,
  data: number[],
};
```

These are all of the values we'll get from the user to make their art and they'll be used in `d3` as values for attributes. In order to use `d3`, we need to write a function outside of the actual component to set up what and how `d3` will draw elements on the page.

### Set up d3.js

Since we know the type of data we expect to be used in `d3`, let's go ahead and write a function to handle the `d3` drawings below the type definition.

```js
// Art.tsx
...

function drawArt(configData: ConfigDataType) {
  const svg = d3
    .select("#art")
    .append("svg")
    .attr("width", configData.svgWidth)
    .attr("height", configData.svgHeight)
    .style("margin-left", 100);

  svg
    .selectAll("rect")
    .data(configData.data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * configData.xMultiplier)
    .attr("y", (d, i) => 300 - configData.yMultiplier * d)
    .attr("width", configData.othWidth)
    .attr("height", (d, i) => d * configData.yMultiplier)
    .attr("fill", configData.color);
}
```

This is a very simple `d3` drawing based on the user input. Honestly, `d3` has a pretty steep learning curve and I usually have the docs open the entire time I'm working. So let's walk through this code in a little more detail.

First, this function selects an HTML element with the `art` id and appends an `svg` HTML element inside it. (We'll make the `art` element in just a bit when we get to the rendered part of the component.) Then we set the `height` and `width` attributes for the `svg` element based on the user input. After that, we add a little `style` to the `svg` to give it a margin on the left.

Now that the `svg` element is there, we can start adding the art inside of it. We start by preemptively selecting all of the `rect` elements that will be created in the `svg`. Then we get the data array the user entered and start appending `rect` elements with attributes for the `x`, `y`, `width`, `height`, and `fill` attributes set based on the user input.

With this function, `d3` is ready to draw something for us.

### Set up the component functions

We're _almost_ ready to render something on the page when the app runs, but we have to set up a few things for the component to work correctly. Below the `drawArt` function, add the following code. It looks like a lot, but we'll explain what's going on.

```js
// Art.tsx
...

export default function Art() {
  const d3ContainerRef = useRef();
  const [configData, setConfigData] = useState<ConfigDataType>({
    color: "black",
    svgHeight: 300,
    svgWidth: 700,
    xMultiplier: 90,
    yMultiplier: 15,
    othWidth: 65,
    data: [12, 5, 6, 6, 9, 10],
  });

  useEffect(() => {
    drawArt(configData);
  }, [configData]);

  function updateArt(e: any) {
    e.preventDefault();

    const newConfigs = {
      color: e.target.color?.value || configData.color,
      svgHeight: e.target.svgHeight?.value || configData.svgHeight,
      svgWidth: e.target.svgWidth?.value || configData.svgWidth,
      xMultiplier: e.target.xMultiplier?.value || configData.xMultiplier,
      yMultiplier: e.target.yMultiplier?.value || configData.yMultiplier,
      othWidth: e.target.othWidth?.value || configData.othWidth,
      data: e.target.data?.value || configData.data,
    };

    setConfigData(newConfigs);
  }

  async function submit(e: any) {
    e.preventDefault();

    if (d3ContainerRef.current === null) {
      return;
    }

    // @ts-ignore
    const dataUrl = await toPng(d3ContainerRef.current, { cacheBust: true });

    const uploadApi = `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "your_upload_preset_value");

    await fetch(uploadApi, {
      method: "POST",
      body: formData,
    });
  }
}
```

We start by creating a ref for the `art` element we targeted in the `drawArt` function. Then we set the initial state of the user input so that something shows on the screen when the app starts up. Next, you can see that we call the `drawArt` function each time the `configData` is changed. This is how we keep appending elements to the `svg`.

Then we have a couple of helper functions. The `updateArt` function takes the values from the user input (we'll make the form for this shortly) and calls `setConfigData` to update the state, which triggers the `drawArt` function. This will only be called when a button is clicked to prevent unexpected re-renders.

The `submit` function is what will get called when a user decides that they want to save the image to Cloudinary. We start by keeping the page from refreshing, then we make sure the ref element isn't empty. Next, we capture the image as a PNG and make a variable for the Cloudinary upload API.

After that, we make a new `FormData` object to hold the values we need to upload an image to Cloudinary. Once the data is ready, we called the `fetch` method to submit a POST request to the API. That's all of the functions we need for the component so the only thing left is the return statement.

### Add the rendered elements

We need a form to get the user input, a couple of buttons, and the ref element. Add this code below all of the component functions we just defined.

```js
// Art.tsx
...

// Art()
...

return (
    <>
      <form onSubmit={updateArt}>
        <div>
          <label htmlFor="color">Color</label>
          <input type="text" name="color" onChange={(e) => e.target.value} />
        </div>
        <div>
          <label htmlFor="svgHeight">SVG Height</label>
          <input
            type="number"
            name="svgHeight"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="svgWidth">SVG Width</label>
          <input
            type="number"
            name="svgWidth"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="xMultiplier">X Multiplier</label>
          <input
            type="number"
            name="xMultiplier"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="yMultiplier">Y Multiplier</label>
          <input
            type="number"
            name="yMultiplier"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="othWidth">Other Width</label>
          <input
            type="number"
            name="othWidth"
            onChange={(e) => e.target.value}
          />
        </div>
        <div>
          <label htmlFor="data">Some Numbers</label>
          <input type="text" name="data" onChange={(e) => e.target.value} />
        </div>
        <button type="submit">See Art</button>
      </form>
      {/* @ts-ignore */}
      <div id="art" ref={d3ContainerRef}></div>
      <button type="submit" onClick={submit}>
        Save picture
      </button>
    </>
  );
}
```

We have a form here with several input fields and a button that calls the `updateArt` method. Then we have the `art` element we select in the `drawArt` function. Finally, there's the button to upload the image whenever the user is ready.

Now you can run the app with `npm start` and you should see something similar to this.

![the artwork](https://res.cloudinary.com/mediadevs/image/upload/v1652751456/e-603fc55d218a650069f5228b/h0952k2d74ozecd5vvpx.png)

That's it! Now you can play around with the values through the form or you can work on the code and make fancier data visualizations.

## Finished code

You can check out the complete code in the [art-generator folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/art-generator) or this Code Sandbox(https://codesandbox.io/s/peaceful-murdock-nlbgpg)

<CodeSandBox
  title="peaceful-murdock-nlbgpg"
  id="peaceful-murdock-nlbgpg"
/>

## Conclusion

Yes, there is beauty in a simple bar chart. When is the last time you were actually able to make a simple bar chart for an app? No fancy transitions, no labels, no real scaling, or showing anything meaningful? That's a special kind of freedom and it does give you a chance to think about other things you can do with your data.
