# Generate Cartoon Avatars in Next

Having an avatar as a profile picture is pretty common these days. There are plenty of tools and artists that can create anything you want so you have unlimited options. You can get as particular as you want and maybe even come up with something no one has seen before.

Of course there's a way to generate all kinds of avatars with JavaScript. That's what we'll be doing in this post with [`faces.js`](https://github.com/dumbmatter/facesjs). This library let's us generate avatars based on a number of factors so we can have a little fun with this.

## Initial setup

We'll this cartoon avatar generator with Next. The whole app will be a form with a number of dropdowns the user can change to get different features for their avatar and then it'll immediately update the displayed avatar. Let's start by creating a new Next app with the following command:

```bash
$ yarn create next-app --typescript
```

Follow the prompts and name the project `cartoon-avatar`. Then we need to install the [`faces.js`](https://www.npmjs.com/package/facesjs) package. We'll also be using the [Material UI library](https://mui.com/) to make the app look better from the beginning. So run the following command to install everything we need:

```bash
$ yarn add facesjs @mui/material @emotion/react @emotion/styled
```

This is all we need to make this app work and look good. Now we can turn our attention to the code. We'll start by building the form since it will have the most moving pieces and it should be its own component.

## Create the form

First, let's create a new folder inside the `pages` folder called `components`. Inside this new components folder, make a new file called `Form.tsx`. This will have a lot of code in it, but remember that it's only because we have a lot of options that we want to offer the user to customize their avatars. So in the `Form.tsx` file, add the following code:

```javascript
// Form.tsx
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { Options } from "../index";

interface FormProps {
  options: Options;
  updateAvatar: (options: any) => void;
}

const Form = ({ options, updateAvatar }: FormProps) => {
  return (
    <Container>
      <form
        style={{
          marginBottom: "24px",
          marginTop: "24px",
          width: "800px",
        }}
      >
        <Stack spacing={2}>
          <FormControl variant="standard">
            <InputLabel id="body">Body</InputLabel>
            <Select
              name="body"
              id="body"
              value={options.body.id}
              onChange={(e) => updateAvatar(e)}
              label="Body"
            >
              <MenuItem value="body">
                <em>None</em>
              </MenuItem>
              <MenuItem value="body2">Type 1</MenuItem>
              <MenuItem value="body3">Type 2</MenuItem>
              <MenuItem value="body5">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="ear">Ear</InputLabel>
            <Select
              name="ear"
              id="ear"
              value={options.ear.id}
              onChange={(e) => updateAvatar(e)}
              label="Ear"
            >
              <MenuItem value="ear1">
                <em>None</em>
              </MenuItem>
              <MenuItem value="ear2">Type 1</MenuItem>
              <MenuItem value="ear3">Type 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="eye">Eye</InputLabel>
            <Select
              name="eye"
              id="eye"
              value={options.eye.id}
              onChange={(e) => updateAvatar(e)}
              label="Eye"
            >
              <MenuItem value="eye13">
                <em>None</em>
              </MenuItem>
              <MenuItem value="eye5">Type 1</MenuItem>
              <MenuItem value="eye19">Type 2</MenuItem>
              <MenuItem value="eye12">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="facialHair">Facial Hair</InputLabel>
            <Select
              name="facialHair"
              id="facialHair"
              value={options.facialHair.id}
              onChange={(e) => updateAvatar(e)}
              label="Facial Hair"
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              <MenuItem value="fullgoatee4">Type 1</MenuItem>
              <MenuItem value="loganSoul">Type 2</MenuItem>
              <MenuItem value="sideburns3">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="glasses">Glasses</InputLabel>
            <Select
              name="glasses"
              id="glasses"
              value={options.glasses.id}
              onChange={(e) => updateAvatar(e)}
              label="Glasses"
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              <MenuItem value="glasses1-primary">Type 1</MenuItem>
              <MenuItem value="glasses2-primary">Type 2</MenuItem>
              <MenuItem value="glasses2-black">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="hair">Hair</InputLabel>
            <Select
              name="hair"
              id="hair"
              value={options.hair.id}
              onChange={(e) => updateAvatar(e)}
              label="Hair"
            >
              <MenuItem value="blowoutFade">
                <em>None</em>
              </MenuItem>
              <MenuItem value="curly">Type 1</MenuItem>
              <MenuItem value="juice">Type 2</MenuItem>
              <MenuItem value="parted">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="head">Head</InputLabel>
            <Select
              name="head"
              id="head"
              value={options.head.id}
              onChange={(e) => updateAvatar(e)}
              label="Head"
            >
              <MenuItem value="head8">
                <em>None</em>
              </MenuItem>
              <MenuItem value="head14">Type 1</MenuItem>
              <MenuItem value="head3">Type 2</MenuItem>
              <MenuItem value="head10">Type 3</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard">
            <InputLabel id="nose">Nose</InputLabel>
            <Select
              name="nose"
              id="nose"
              value={options.nose.id}
              onChange={(e) => updateAvatar(e)}
              label="Nose"
            >
              <MenuItem value="nose6">
                <em>None</em>
              </MenuItem>
              <MenuItem value="nose5">Type 1</MenuItem>
              <MenuItem value="nose13">Type 2</MenuItem>
              <MenuItem value="nose9">Type 3</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </form>
    </Container>
  );
};

export default Form;
```

The first thing we do is import some components from MUI and a type from the `index.tsx` file. Don't worry about that type yet because we'll get to it in a later section. After all the imports, we create another type for the props that get sent to the form. Finally, we write the return statement that has the form fields.

There are 9 option dropdowns with 3-4 variations each. The options and their variants are based on values directly from the `faces.js` library. You can play around with some of the other SVG values provided by the library if you want to add more variants or options. Each time a dropdown is changed, we call the `updateAvatar` function that gets passed as a prop.

This is everything for the form users will interact with. Now we can jump over to the part where we actually render the avatar based on the user's inputs.

## Add the avatar

This is where we get to have some fun and see things in action. Open the `index.tsx` file in the `pages` folder and delete everything. Then add the following code:

```javascript
// index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import * as faces from "facesjs";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Form from "./components/Form";

export interface Options {
  body: { id: string };
  ear: { id: string };
  eye: { id: string };
  facialHair: { id: string };
  glasses: { id: string };
  hair: { id: string };
  head: { id: string };
  mouth: { id: string };
  nose: { id: string };
}

const Home: NextPage = () => {
  const [options, setOptions] =
    useState <
    Options >
    {
      body: { id: "body2" },
      ear: { id: "ear3" },
      eye: { id: "eye5" },
      facialHair: { id: "none" },
      glasses: { id: "glasses2-black" },
      hair: { id: "juice" },
      head: { id: "head3" },
      mouth: { id: "mouth5" },
      nose: { id: "nose9" },
    };

  const face = faces.generate();

  useEffect(() => {
    faces.display("avatar", face, options);
  }, [face, options]);

  function updateAvatar(e: any) {
    e.preventDefault();

    const updatedOptions = {
      ...options,
      [e.target.name]: { id: e.target.value },
    };

    setOptions(updatedOptions);
  }

  return (
    <div>
      <Head>
        <title>What Avatar Is Yours</title>
        <meta
          name="description"
          content="uses faces.js to make random avatars"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ width: "100%" }}>
        <Container>
          <h1>{`What's your face?`}</h1>
          <Form options={options} updateAvatar={updateAvatar} />
          <div
            id="avatar"
            style={{ margin: "0 auto", height: "auto", width: "300px" }}
          ></div>
        </Container>
      </main>
    </div>
  );
};

export default Home;
```

This is where we display the form and the avatar to users. We start by importing a few components and methods we need. You'll see the `faces.js` library and our custom form component to note a few things. Next, we define the `Options` type that we imported in the `Form` component. So we know what the `faces.js` library expects. Then we get into the `Home` component.

Inside the `Home` component, we start by setting an initial state for the options. Then we create a new instance of an avatar using the `generate` method provided by `faces`. After that, we have a `useEffect` hook to make update the avatar being displayed every time an option is updated. Next, there is the `updateAvatar` function that will get called each time a form value is changed.

We do a little object trick in this function to only update the value that has been changed instead of needing to update all of the values. Then we start adding components to the return statement here. The main things we return are the form and the `<div>` that the `faces` library targets in the `display` method called in the `useEffect` hook.

That's actually all we have to do for this app! Now you can play around with the avatars that get generated.

![complete avatar app](https://res.cloudinary.com/mediadevs/image/upload/v1656343011/e-603fc55d218a650069f5228b/gvepuzwfcou9uvuy4efr.png)

## Finished code

You can check out all of the code in the `qr-card` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/cartoon-avatar). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/elated-leaf-s5di51).

<CodeSandBox
  title="elated-leaf-s5di51"
  id="elated-leaf-s5di51"
/>

## Conclusion

There are a lot of ways to practice your JavaScript skills. For example, how would you have handled that object that gets updated based on a dynamic value? These are the little things that make app building a little faster every time you go through the process. Except in this case, instead of worrying about what happens in production, you get to see if your experiments work by looking at your avatar.
