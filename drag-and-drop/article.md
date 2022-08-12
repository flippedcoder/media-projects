# Implement drag and drop on images in Vue

Implement drag and drop functionality on cloudinary images

## Set up Vue project

Make sure you have Vue installed globally first. You can check that you have it installed with the following command:

```bash
$ vue --version

@vue/cli 5.0.8
```

If you don't have Vue installed, check out [the instructions here](https://cli.vuejs.org/guide/installation.html). After this check, we can generate a new Vue project with this command:

```bash
$ vue create drag-and-drop

Vue CLI v5.0.8
? Please pick a preset: Default ([Vue 3] babel, eslint)
```

Select the Vue 3 version because this is the most up to date version. Once the project has been setup, go to the `drag-and-drop` directory and briefly look through the files to get a sense of what we're starting with. Go to `src > components > HelloWorld.vue`. This is the file we're going to modify to implement the drag and drop functionality with the images we fetch from Cloudinary.

If you don't already have a Cloudinary account, go set one up for free [here](https://cloudinary.com/users/register/free). Upload a few images that you want to play with in this app. Then take note of your `cloud name` in the Dashboard. You'll need this to display the images we'll drag around. One last thing we need to do is install the packages we'll be working with. Run the following command to do that:

```bash
npm i buffer
```

## Making the Cloudinary request for the images

We'll start by updating the code in the `<script>` tags.

## Render the images

## Add drag and drop functionality

## Finished code

You can take a look at the complete code in [the `camera-filter` folder of this repo](https://github.com/flippedcoder/media-projects/tree/main/camera-filter). Or you can check it out in [this Code Sandbox](https://codesandbox.io/s/cocky-flower-25dg3x).

<CodeSandBox
  title="cocky-flower-25dg3x"
  id="cocky-flower-25dg3x"
/>

## Conclusion

Getting into advanced styling techniques and learning about some of the visualization libraries is a great way to stay ahead of the curve. With all of the virtual interactions we all have, it's a good skill to know how to render more complex things for users.
