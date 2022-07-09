# Make a Custom Camera Filter in React

With almost everything being online, having the ability to add custom filters to your camera can be pretty useful. We're going to build a React app that let's users adjust a filter for their webcam and then save the image to Cloudinary.

We'll be using [Material UI](https://mui.com/) to help make our app look production-ready faster and we'll be using [p5.js](https://p5js.org/) to let us apply filters to a user's camera. Once you finish this project, you'll be able to start working with p5.js in all kinds of media apps.

## Setting up the React app

We can use the [create-react-app](https://create-react-app.dev/docs/adding-typescript/) command to generate a new React project with TypeScript enabled so we can be ready to add types from the beginning. Open your terminal and run the following command.

```bash
$ npx create-react-app camera-filter --template typescript
```

You should see a new folder called `camera-filter` and it will have a number of boilerplate files to get us started. There are a few packages we'll need to handle the camera filter and the upload to Cloudinary.

```bash
$ npm i p5 @types/p5 html-to-image @mui/material @emotion/react @emotion/styled
```

These are the packages we need to make the filter for the camera. Also, if you don't have a Cloudinary account make sure you [create a free one](https://cloudinary.com/users/register/free) before we move forward because you'll need credentials to upload the pictures to this hosting service.

Now we can work on a new component for our camera filter.

## Adding the camera filter component

Go to the `src` folder in the root of your project and add a new sub-folder called `components`. Inside this folder, add a file called `CameraFilter.tsx`. This is a common file structure you'll run into with React projects to help keep things organized. Since the camera filter won't be a whole page by itself, we classify it as a component.

Let's start building the camera filter by importing the following packages at the top of the `CameraFilter.tsx` file.

```tsx
// CameraFilter.tsx

import { useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import p5 from "p5";
```

These are the main packages we'll start with and we'll slowly add MUI elements as needed. Now let's add the functionality we need for p5.js to apply filters to the camera.

### Setting up p5.js

Getting this working React projects can be a little tricky, but once you do it, you have a lot of power over how things are displayed on your site. This package has a lot of really interesting functionality you should check out. Make sure you have the `CameraFilter.tsx` file open and add the following code below the imports.

```tsx
// CameraFilter.tsx
...

let cam: any, custShader: any;

function sketch(p: any) {
  // p is a reference to the p5 instance this sketch is attached to
  p.preload = () => {
    custShader = p.loadShader("../assets/webcam.vert", "../assets/webcam.frag");
  };

  p.setup = () => {
    // shaders require WEBGL mode to work
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.noStroke();

    // initialize the webcam at the window size
    cam = p.createCapture(p.VIDEO);
    cam.size(p.windowWidth, p.windowHeight);

    // hide the html element that createCapture adds to the screen
    cam.hide();
  };

  p.draw = () => {
    // shader() sets the active shader with our shader
    p.shader(custShader);

    // lets just send the cam to our shader as a uniform
    custShader.setUniform("tex0", cam);

    // the size of one pixel on the screen
    custShader.setUniform("stepSize", [1.0 / p.width, 1.0 / p.height]);

    // how far away to sample from the current pixel
    // 1 is 1 pixel away
    custShader.setUniform("dist", 3.0);

    // rect gives us some geometry on the screen
    p.rect(0, 0, p.width, p.height);
  };
}
```

This code sets some variables we need for p5 to work with the camera and a custom shader to make the filter. You can [learn more about WebGL shaders here](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html) so that you'll know how to make your own shaders. This could be useful if you plan on working with 3D media in your web apps.

Next, we create the `sketch` function that will hold all of the methods p5 will call to get the camera filter set up and ready to use when we create a new instance of the p5 object a bit later. The `sketch` function implements a few methods that p5 will expect.

In order to use our custom filter, we'll need a `preload` method for the p5 object. This will call the `loadShader` method from p5 with paths to our shader assets to make the shader ready to use. Then we have the `setup` method that tells p5 what to do with the DOM as soon as it loads on the page. Finally, we have the `draw` method which applies the shader to the camera we initiated in the `setup` method.

### The camera component

With all of the p5 setup ready to use, we need create the component that gets rendered in the browser. Beneath the p5 code, add the following code.

```tsx
// CameraFilter.tsx
...

export default function CameraFilter() {
  const p5ContainerRef = useRef();

  useEffect(() => {
    // On component creation, instantiate a p5 object with the sketch and container reference
    const p5Instance = new p5(sketch, p5ContainerRef.current);

    // On component destruction, delete the p5 instance
    return () => {
      p5Instance.remove();
    };
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    if (p5ContainerRef.current === null) {
      return;
    }

    // @ts-ignore
    const dataUrl = await toPng(p5ContainerRef.current, { cacheBust: true });

    const uploadApi = `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "your_upload_preset");

    await fetch(uploadApi, {
      method: "POST",
      body: formData,
    });
  }

  return (
    <>
      {/* @ts-ignore */}
      <div id="camera" ref={p5ContainerRef}></div>
      <button type="submit" onClick={submit}>
        Save picture
      </button>
    </>
  );
}
```

Let's walk through this from the beginning. First, we use the `useRef` hook from React to define the HTML reference to the element we'll render the p5 shader on. Then we take advantage of the `useEffect` hook to create an instance of the p5 object using the `sketch` function we wrote earlier when the component is created. We also clean up and remove the p5 instance when the component is destroyed to make sure we don't have any weird behavior.

Next, we create the `submit` function for when we decide to save a picture that's been altered by our filter. Inside this function, a few things happen. We check and make sure that the referenced element has something in it currently and if it doesn't we just return from the function. If it _does_ have something in it, then we use the `html-to-image` package to create a PNG file for the filtered image.

After we have the PNG file, then we make a variable that holds the API connection string to Cloudinary. Make sure you update this to use your own cloud name so that the images will go to your Cloudinary account. Next, we create a new `FormData` object that will hold all of the values Cloudinary needs to accept our upload programatically. You'll also need to update the upload preset to match your Cloudinary account. You can find this value in [your account settings]().

The last thing we do in the `submit` function is call the `fetch` API to send our filtered image to Cloudinary. The only things remaining for this component are the actual rendered elements.

As you can see, there isn't much that gets rendered on the page. We have the `<div>` that the p5 instance references and a button that calls the `submit` function when we want to save an image. All that's left for our camera filter is defining the shader files that define what the filter does to the image.

## Writing shader files

Like we mentioned eariler, you can [learn more about WebGL shaders here](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html) and I highly recommend you take a look because understanding what's happening in these files is important. We aren't going to do a deep dive into these files because it takes some understanding of topics outside of the scope of this tutorial. We _will_ however create a couple of files to make our custom shader.

In the `src` directory, add a new sub-directory called `assets`. Inside that folder, make two new files: `webcam.vert` and `webcam.frag`. These will make our custom shader. Add the following code to the `webcam.vert` file.

```
// webcam.vert

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;

  // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  // send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}
```

Then open the `webcam.frag` file and add this code.

```
// webcam.frag

precision mediump float;

// our texcoords from the vertex shader
varying vec2 vTexCoord;

// the texture that we want to manipulate
uniform sampler2D tex0;

// how big of a step to take. 1.0 / width = 1 texel
// doing this math in p5 saves a little processing power
uniform vec2 stepSize;
uniform float dist;

// an array with 9 vec2's
// each index in the array will be a step in a different direction around a pixel
// upper left, upper middle, upper right
// middle left, middle, middle right
// lower left, lower middle, lower right
vec2 offset[9];

// the convolution kernel we will use
// different kernels produce different effects
// we can do things like, emboss, sharpen, blur, etc.
float kernel[9];

// the sum total of all the values in the kernel
float kernelWeight = 0.0;

// our final convolution value that will be rendered to the screen
vec4 conv = vec4(0.0);

void main(){

	vec2 uv = vTexCoord;
  // flip the y uvs
  uv.y = 1.0 - uv.y;

  // different values in the kernels produce different effects
  // take a look here for some more examples https://en.wikipedia.org/wiki/Kernel_(image_processing) or https://docs.gimp.org/en/plug-in-convmatrix.html

  // here are a few examples, try uncommenting them to see how they affect the image

  // emboss kernel
  kernel[0] = -2.0; kernel[1] = -1.0; kernel[2] = 0.0;
  kernel[3] = -1.0; kernel[4] = 1.0; kernel[5] = 1.0;
  kernel[6] = 0.0; kernel[7] = 1.0; kernel[8] = 2.0;

  // sharpen kernel
  // kernel[0] = -1.0; kernel[1] = 0.0; kernel[2] = -1.0;
  // kernel[3] = 0.0; kernel[4] = 5.0; kernel[5] = 0.0;
  // kernel[6] = -1.0; kernel[7] = 0.0; kernel[8] = -1.0;

  // gaussian blur kernel
  // kernel[0] = 1.0; kernel[1] = 2.0; kernel[2] = 1.0;
  // kernel[3] = 2.0; kernel[4] = 4.0; kernel[5] = 2.0;
  // kernel[6] = 1.0; kernel[7] = 2.0; kernel[8] = 1.0;

  // edge detect kernel
  // kernel[0] = -1.0; kernel[1] = -1.0; kernel[2] = -1.0;
  // kernel[3] = -1.0; kernel[4] = 8.0; kernel[5] = -1.0;
  // kernel[6] = -1.0; kernel[7] = -1.0; kernel[8] = -1.0;

	offset[0] = vec2(-stepSize.x, -stepSize.y); // top left
	offset[1] = vec2(0.0, -stepSize.y); // top middle
	offset[2] = vec2(stepSize.x, -stepSize.y); // top right
	offset[3] = vec2(-stepSize.x, 0.0); // middle left
	offset[4] = vec2(0.0, 0.0); //middle
	offset[5] = vec2(stepSize.x, 0.0); //middle right
	offset[6] = vec2(-stepSize.x, stepSize.y); //bottom left
	offset[7] = vec2(0.0, stepSize.y); //bottom middle
	offset[8] = vec2(stepSize.x, stepSize.y); //bottom right

	for(int i = 0; i<9; i++){
		//sample a 3x3 grid of pixels
		vec4 color = texture2D(tex0, uv + offset[i]*dist);

    // multiply the color by the kernel value and add it to our conv total
		conv += color * kernel[i];

    // keep a running tally of the kernel weights
		kernelWeight += kernel[i];
	}

  // normalize the convolution by dividing by the kernel weight
  conv.rgb /= kernelWeight;

	gl_FragColor = vec4(conv.rgb, 1.0);
}
```

This will create a convolution kernal effect to the camera, giving us our custom filter. You can find the source code for this shader and others in [this repo](https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-15_convolution-kernel). The shader files are already referenced in code we wrote earlier, so we are finished!

The only thing left to do is run your project with `npm start` and take a look at how the filter changes the camera image.

![camera with shader filter applied](https://res.cloudinary.com/mediadevs/image/upload/v1651635690/e-603fc55d218a650069f5228b/bhunsjhxysqoqmjy92vf.png)

## Finished code

You can take a look at the complete code in [the `camera-filter` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/camera-filter). Or you can check it out in [this Code Sandbox](https://codesandbox.io/s/cocky-flower-25dg3x).

<CodeSandBox
  title="cocky-flower-25dg3x"
  id="cocky-flower-25dg3x"
/>

## Conclusion

Getting into advanced styling techniques and learning about some of the visualization libraries is a great way to stay ahead of the curve. With all of the virtual interactions we all have, it's a good skill to know how to render more complex things for users.
