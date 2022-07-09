# Build a Virtual World with User Input

Working with virtual reality (VR) has typically involved building apps and worlds using tools like Unity and Unreal Engine and headsets. You don't need to have all of these things if you know some basic HTML and JavaScript. You can build and test your own virtual world directly in the browser without a headset.

We're going to build a simple VR app using the [A-frame library](https://aframe.io/). Any apps you build with this can be developed in the browser and used on any of the popular headsets. This project is going to be different from a lot of other projects because we aren't going to use a JavaScript framework. This will just be an HTML file and a JavaScript file.

## Make the VR world

This little VR world will consist of a few boxes falling from the sky that let you change the material for a robot figure. Let's start by creating a new folder called `virtual-world`. Inside this folder, add a file called `world.html` and another file called `change-materials.js`. Open the `world.html` file and add the following code.

```html
<html>
  <head>
    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
  </head>
  <body>
    <a-scene background="color: #7BFAFA"> </a-scene>
  </body>
</html>
```

This sets up the HTML file to use A-frame and we have a scene in the `<body>` to get things started. The way we use A-frane elements is very similiar to working with regular HTML elements. They all have attributes we can add to get different behaviors and looks. In `<a-scene>`, there's a `background` attribute that sets the color for the entire scene or world.

Now we need a way to look around and interact with the world, so we'll add the camera for the user.

### Add the camera and marker

Knowing where you are in a virtual world is the only way you can move around and do things. That's why the camera placement and having an indicator for where the user is looking are important. Add the following code just above the closing `<a-scene>` tag.

```html
<!-- set the camera for the user -->
<a-camera look-controls id="world-camera" position="0 3 0">
  <a-entity
    cursor="fuse: true; fuseTimeout: 500"
    position="0 0 -1"
    geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.03"
    material="color: black; shader: flat"
    id="marker"
  ></a-entity>
</a-camera>
```

This tells A-frame that the camera is being used for the `look-controls` that let us do things in the world. It also has a cursor as part of the camera so the user can always see where their focus is. Since we have the scene and the camera in place now, we need to put something in the world. So let's start with the boxes falling out of the sky.

### Add material selection boxes

There are going to be a couple of boxes that let us decide whether the robot should be made out of wood or metal. We'll use some images we have on Cloudinary as the basis for the materials. Add the following code inside of the `<a-scene>` tags.

```html
<!-- assets for the scene -->
<a-assets>
  <img
    id="woodTexture"
    src="https://res.cloudinary.com/milecia/image/upload/v1653756834/wood_vuxmb7.jpg"
    crossorigin="anonymous"
  />
  <img
    id="metalTexture"
    src="https://res.cloudinary.com/milecia/image/upload/v1653776620/metal_ehet1g.jpg"
    crossorigin="anonymous"
  />
</a-assets>
```

Any time you want to add new textures, audio, or even 3D objects to your world, you'll have to add them as assests at the top of your scene. Here, we have 2 images as part of our assets to define the metal and wood materials for the robot. Now we can create the boxes that show off those materials. Add the following code below the assets.

```html
<!-- boxes that drop in -->
<a-box
  id="woodBox"
  position="-1 6 -3"
  rotation="0 45 0"
  src="#woodTexture"
  animation__position="property: object3D.position.y; to: 1;"
></a-box>
<a-box
  id="metalBox"
  position="2 6 -3"
  src="#metalTexture"
  animation__position="property: object3D.position.y; to: 1;"
></a-box>
<a-plane
  position="0 0 -5"
  rotation="-90 0 0"
  width="60"
  height="60"
  color="#7C992B"
></a-plane>
```

We've just added 2 boxes with `src` attributes that reference the image assets we pulled from Cloudinary. They both have the `animation__position` attribute which is what defines how they fall to the ground. Take note that we've created IDs for these boxes because we'll be adding click events to them.

Finally, there's a plane that defines the ground the entire world is based on. Now if you open the `world.html` file in a browser, you should see something like this.

![the ground, sky, and boxes of the world](https://res.cloudinary.com/mediadevs/image/upload/v1653778737/e-603fc55d218a650069f5228b/hldhp5kz92ttet2mrx8f.png)

### Build the robot

We've built an environment for things to exist in and we have a way to update textures to wood or metal. Now it's finally time to build the robot. Below the `<a-plane>` tag, add the following code.

```html
<!-- robot right leg -->
<a-box
  class="robot"
  position="2 1.25 -5"
  height="2.5"
  width="0.75"
  depth="0.75"
  color="#bcc9b5"
  shadow
></a-box>
<!-- robot left leg -->
<a-box
  class="robot"
  position="0.25 1.25 -5"
  height="2.5"
  width="0.75"
  depth="0.75"
  color="#bcc9b5"
  shadow
></a-box>
<!-- robot waist -->
<a-box
  class="robot"
  position="1.15 2.5 -5"
  height="0.5"
  width="2.5"
  depth="0.75"
  color="#bcc9b5"
  shadow
></a-box>
<!-- robot body -->
<a-box
  class="robot"
  position="1 3.75 -5"
  height="3"
  width="1"
  depth="1"
  color="#bcc9b5"
  shadow
></a-box>
<!-- robot head -->
<a-box
  class="robot"
  position="1 5.75 -5"
  height="1.25"
  width="1.75"
  depth="1.25"
  color="#bcc9b5"
  shadow
></a-box>
<!-- base of robot right arm -->
<a-cylinder
  class="robot"
  position="2.25 4.25 -5"
  radius="0.35"
  height="2"
  color="#bcc9b5"
  segments-radial="6"
  rotation="0 0 90"
></a-cylinder>
<!-- second part of robot right arm -->
<a-cylinder
  class="robot"
  position="3.8 3.75 -5"
  radius="0.35"
  height="2"
  color="#bcc9b5"
  segments-radial="6"
  rotation="0 0 45"
></a-cylinder>
<!-- base of robot left arm -->
<a-cylinder
  class="robot"
  position="-0.25 4.25 -5"
  radius="0.35"
  height="2"
  color="#bcc9b5"
  segments-radial="6"
  rotation="0 0 90"
></a-cylinder>
<!-- second part of robot left arm -->
<a-cylinder
  class="robot"
  position="-1.8 5 -5"
  radius="0.35"
  height="2"
  color="#bcc9b5"
  segments-radial="6"
  rotation="0 0 45"
></a-cylinder>
```

We're using a lot of A-frame primitive shapes to make this robot so you can have a lot of fun with this later. You might also consider making a 3D object in [Blender](https://www.blender.org/) or you might try some of the free 3D objects [here](https://clara.io/library) or [here](https://archive3d.net/). We'll keep it pretty basic here with just the built-in A-frame primitives.

All of the shapes have essentially the same attributes, just changed to handle the positioning of robot parts correctly. Once you have all of the robot code in place, you should see something like this when you refresh the page.

![robot in the scene with the boxes](https://res.cloudinary.com/mediadevs/image/upload/v1653779738/e-603fc55d218a650069f5228b/wfiwvqhueoeo3pld2lyt.png)

All that's left is implementing the functionality to update the robot's material when one of the boxes is selected.

### Add an A-frame component

We'll update the robot's material through an A-frame component. Open the `change-materials.js` file and add the following code.

```js
AFRAME.registerComponent("change-materials", {
  init: () => {
    const woodBox = document.querySelector("#woodBox");
    const metalBox = document.querySelector("#metalBox");
    const robotBody = document.querySelectorAll(".robot");

    woodBox.addEventListener("click", () => {
      robotBody.forEach((part) => {
        part.setAttribute("src", "#woodTexture");
      });
    });

    metalBox.addEventListener("click", () => {
      robotBody.forEach((part) => {
        part.setAttribute("src", "#metalTexture");
      });
    });
  },
});
```

This creates a new A-frame component called `change-materials` that we can reference on elements in the scene. In the `init` function, we're getting the elements in the scene based on their IDs and class. This is much like we would do in a regular web app. Next, we add some click event listeners to the metal and wood boxes that will update the `src` for each part of the robot's body.

We do need to add references to this `change-materials` component in the HTML file. Add the following import to the `<head>` tag.

```html
<script src="change-materials.js"></script>
```

Now we have the A-frame component accessible to the scene. We'll need to add this as an attribute to the wood and metal boxes. Update those elements like this.

```html
<a-box
  id="woodBox"
  position="-1 6 -3"
  rotation="0 45 0"
  src="#woodTexture"
  animation__position="property: object3D.position.y; to: 1;"
  change-materials
></a-box>
<a-box
  id="metalBox"
  position="2 6 -3"
  src="#metalTexture"
  animation__position="property: object3D.position.y; to: 1;"
  change-materials
></a-box>
```

The only difference is that now these boxes have the `change-materials` attribute. This is how A-frame works with components so now these elements will have the correct event listeners. If you reload the page and move the marker over one of the boxes, your robot should look like one of these.

![metal robot](https://res.cloudinary.com/mediadevs/image/upload/v1653780759/e-603fc55d218a650069f5228b/w6oxfbegc0gftwkwgsfv.png)

![wood robot](https://res.cloudinary.com/mediadevs/image/upload/v1653780729/e-603fc55d218a650069f5228b/m8qd19xumo0dvprbf7m9.png)

That's all! Now you can add more assets or more user interactions. If you have a VR headset, I'd encourage you to try it out there as well!

## Finished Code

You can find the code for this project in the [`virtual-world` folder of this repo]() or you can check it out in this [Code Sandbox](https://codesandbox.io/s/optimistic-hellman-5kuetw).

<CodeSandBox
  title="optimistic-hellman-5kuetw"
  id="optimistic-hellman-5kuetw"
/>

## Conclusion

Working with VR takes a number of different skills which is part of the fun of it. From building assets, deciding on textures, and creating a whole experience for users, you can go in a lot of different directions. This is another creative way to practice your JavaScript or test out a new career path.
