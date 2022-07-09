# Create 3D Models with WebGL

There are a lot of different technologies that are in the browser that enable a lot of interesting functionality. One of these things is WebGL. You can make all kinds of advanced animations and models, some of which can be used in other applications. We're going to go through a tutorial on how to make a 3D model in WebGL.

If you're using the Chrome browser, like me, you'll need to enable WebGL. You can do that by going to chrome://flags and enabling the WebGL options. With those enabled, let's start with a little background on what WebGL is.

## Brief background on WebGL

WebGL is a JavaScript API that lets us render 2D and 3D graphics in the browser without any extra plugins. It utilizes the hardware on the user's computer. It works with OpenGL to let us render these high performance graphics in an HTML canvas element. So you can create complex models and animations with JavaScript and make them interactive for users.

Learning the syntax to build decent models in WebGL can take time since you're dealing with vertices of objects, shaders to handle color effects, and possibly animations. While all of this is handled through JavaScript, it can still be different from what you're used to with regular development.

Let's go ahead and start making the model with just an HTML file and a JavaScript file. (When's the last time you did that?)

## Set up the canvas

We'll start by creating a new HTML file called `index.html`. This will have a few JavaScript imports and a canvas to support our 3D model. Add the following code to your new file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>WebGL 3D Model</title>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.8.1/gl-matrix-min.js"
      integrity="sha512-zhHQR0/H5SEBL3Wn6yYSaTTZej12z0hVZKOv3TwCUXT1z5qeqGcXJLLrbERYRScEDDpYIJhPC1fk31gqR783iQ=="
      crossorigin="anonymous"
      defer
    ></script>
    <script src="model.js" defer></script>
  </head>

  <body>
    <canvas id="glcanvas" width="640" height="480"></canvas>
  </body>
</html>
```

We're importing the [`gl-matrix` library](https://www.npmjs.com/package/gl-matrix) to support the model rendering and animation in WebGL and we're importing a custom `model.js` file to load the model we're about to build. Finally, we define the `<canvas>` element that model will be rendered in. That's all we need for the HTML! Now let's start working on that `model.js` file.

## Make the WebGL context

In the same folder as `index.html` add a new JavaScript file called `model.js`. This is where we'll do all of the fancy WebGL model building. There are libraries like [three.js](https://threejs.org/) and [Babylon.js](https://www.babylonjs.com/) that can handle this for us, but you still have to know what's happening under the hood to use it effectively.

To kick things off, let's start by defining the WebGL context. This is the only way we can render objects in that `<canvas>` element with WebGL. In the `model.js` file, add the following code.

```javascript
main();

function main() {
  const canvas = document.querySelector("#model-container");

  const wgl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // If we don't have a GL context, return error message
  if (!wgl) {
    alert("Try to enable WebGL in Chrome.");
    return;
  }
}
```

That's all for setting up the context.

## Add a 2D object

## Make the shader

You'll run into two shader functions when working with WebGL: the fragment shader and the vertex shader. The fragment shader is called after the object's vertices have been handled by the vertex shader. It's called once for each pixel on the object. The vertex shader transforms the input vertex into the coordinate system used by WebGL. This is what we use to define lighting and textures on the model.

In `model.js`, add the following code beneath the alert we made earlier to define the vertex shader.

```javascript
// model.js
...
const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;
...
```

This is all written using the [OpenGL Shading Language (GLSL)](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language). What's happening here is all of the calculations to render the shader to the vertices of the object we're going to draw. Now let's add the fragment shader below the vertex shader.

```javascript
// model.js
...
const fsSource = `
  varying lowp vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }
`;
...
```

This is responsible for applying the color to the sides of the object and is also written in GLSL. Next, we need to initialize the shader functions so they can be used together. Add this code after the fragment shader.

```javascript
// model.js
...
const shaderProgram = initShaderProgram(wgl, vsSource, fsSource);

const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: wgl.getAttribLocation(shaderProgram, "aVertexPosition"),
    vertexColor: wgl.getAttribLocation(shaderProgram, "aVertexColor"),
  },
  uniformLocations: {
    projectionMatrix: wgl.getUniformLocation(
      shaderProgram,
      "uProjectionMatrix"
    ),
    modelViewMatrix: wgl.getUniformLocation(
      shaderProgram,
      "uModelViewMatrix"
    ),
  },
};
...
```

This takes the shader functions we wrote and defines the object that will tell WebGL what do with our model. You'll notice we have a function called `initShaderProgram` that we need to define. Outside of the `main` function, add the following code below it.

```javascript
// model.js
...
function initShaderProgram(wgl, vsSource, fsSource) {
  const vertexShader = loadShader(wgl, wgl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(wgl, wgl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = wgl.createProgram();

  wgl.attachShader(shaderProgram, vertexShader);
  wgl.attachShader(shaderProgram, fragmentShader);
  wgl.linkProgram(shaderProgram);

  if (!wgl.getProgramParameter(shaderProgram, wgl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        wgl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}
```

This function converts the individual shader functions into a shader program that WebGL will use to apply colors to the 3D object. But you'll probably see there's another helper function we need called `loadShader`. Add this below the `initShaderProgram` function we just defined.

```javascript
// model.js
...
function loadShader(wgl, type, source) {
  const shader = wgl.createShader(type);

  wgl.shaderSource(shader, source);

  wgl.compileShader(shader);

  if (!wgl.getShaderParameter(shader, wgl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + wgl.getShaderInfoLog(shader)
    );

    wgl.deleteShader(shader);

    return null;
  }

  return shader;
}
```

This takes the vertex and fragment shader functions and compiles them to something WebGL can interpret. There's just one more function we need to make sure the shader is applied to the model with the colors we want.

We need to define the models vertices and the colors we want to apply.

## Create the 3D model

We need to create an array of the vertex colors and store it in a WebGL buffer. That's how WebGL will actually render the 3D model on the page. So below the `loadShader` function, add this.

```javascript
// model.js
...
function initBuffers(wgl) {
  const positionBuffer = wgl.createBuffer();

  wgl.bindBuffer(wgl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  wgl.bufferData(
    wgl.ARRAY_BUFFER,
    new Float32Array(positions),
    wgl.STATIC_DRAW
  );

  const faceColors = [
    [0.0, 0.6, 0.78, 1.0],
    [0.25, 0.0, 0.0, 0.5],
    [0.0, 1.0, 0.33, 1.0],
    [0.0, 0.42, 0.74, 0.8],
    [1.0, 1.0, 0.0, 0.62],
    [0.32, 0.0, 0.55, 0.39],
  ];

  let colors = [];

  faceColors.map((faceColor) => {
    colors = colors.concat(faceColor, faceColor, faceColor, faceColor);
  });

  const colorBuffer = wgl.createBuffer();

  wgl.bindBuffer(wgl.ARRAY_BUFFER, colorBuffer);
  wgl.bufferData(wgl.ARRAY_BUFFER, new Float32Array(colors), wgl.STATIC_DRAW);

  const indexBuffer = wgl.createBuffer();

  wgl.bindBuffer(wgl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  const indices = [
    0, 1, 2,
    0, 2, 3, // front
    4, 5, 6,
    4, 6, 7, // back
    8, 9, 10,
    8, 10, 11, // top
    12, 13, 14,
    12, 14, 15, // bottom
    16, 17, 18,
    16, 18, 19, // right
    20, 21, 22,
    20, 22, 23, // left
  ];

  wgl.bufferData(
    wgl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    wgl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}
```

This looks like a lot is going on, but it's not as bad as it seems. Most of this function is made of the matrices that define the vertices for the model, which is a cube, and the colors we want on the faces of it. This adds those model matrices to a WebGL buffer that will be used to show the object in the `<canvas>`. If you aren't familiar with matrix math, you should check out a few resources on it.

There's one more function we need to render what's in our WebGL buffer to the screen and that will be the logic that draws the scene in the canvas element. Below the `initBuffers` function, add this code.

```javascript
// model.js
...
function drawScene(wgl, programInfo, buffers, deltaTime) {
  wgl.clearColor(0.2, 0.35, 0.15, 1.0);
  wgl.clearDepth(1.0);
  wgl.enable(wgl.DEPTH_TEST);
  wgl.depthFunc(wgl.LEQUAL);

  wgl.clear(wgl.COLOR_BUFFER_BIT | wgl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = wgl.canvas.clientWidth / wgl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, [-3.7, -1.0, -16.0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 1, 0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [1, 1, 1]);

  {
    const numComponents = 3;
    const type = wgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    wgl.bindBuffer(wgl.ARRAY_BUFFER, buffers.position);
    wgl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    wgl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = wgl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    wgl.bindBuffer(wgl.ARRAY_BUFFER, buffers.color);
    wgl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    wgl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  wgl.bindBuffer(wgl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  wgl.useProgram(programInfo.program);

  wgl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );

  wgl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const vertexCount = 36;
    const type = wgl.UNSIGNED_SHORT;
    const offset = 0;
    wgl.drawElements(wgl.TRIANGLES, vertexCount, type, offset);
  }

  cubeRotation += deltaTime;
}
```

This hefty function is what determines what is shown to users. It starts by clearing out the canvas and getting it ready for WebGL. Then we do some math operations to determine where the object is located in space and how big the space should appear. Then we put the model vertices into the view, apply the shader, and draw the elements in the canvas.

The very last thing we need to do so all of these helper functions are put to use is add a bit more code to our `main` function that gets called when the page is loaded. Inside the `main` function, just below the `programInfo` object, add these lines.

```javascript
// model.js
...
const programInfo = {
  ...
  // existing code is still there
};

const buffers = initBuffers(wgl);

let then = 0;

function render(now) {
  now *= 0.001; // convert to seconds
  const deltaTime = now - then;
  then = now;

  drawScene(wgl, programInfo, buffers, deltaTime);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
...
```

Finally, this is where we initialize the WebGL buffer and create a `render` function that slowly rotates the cube in space and displays it in the canvas. This is a simple model, but once you see it in action, it's surprisingly smooth.

## Finished code

You can check out the complete code for this project in the [`webgl-3d-model` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/webgl-3d-model). You can also check it out in [this Code Sandbox](https://codesandbox.io/s/admiring-hellman-ise7zf).

<CodeSandBox
  title="admiring-hellman-ise7zf"
  id="admiring-hellman-ise7zf"
/>

## Conclusion

Now that you've created a basic model, you can start playing around with fancier models. Maybe try to make a WebGL version of your favorite video game character. It's fun because it's always wonky when you get started, but once you really get the vertices and shaders like you want, it can look pretty good.
