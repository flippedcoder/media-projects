# Create a Fireworks Animation in React

With the Fourth of July right around the corner, this seeems like a great time to practice building some custom animations with fireworks! Sometimes you'll work on projects that need some advanced animations, like an ecommerce or gaming site, and it can take some time to get them to function like you expect.

That's why we're going to use [`anime.js`](https://animejs.com/) to implement a simple fireworks animation that can be customized by users. You'll see how you can create some cool animations using CSS and this package.

## Initial setup

We'll need to create a new React app to get started. Run this command to bootstrap the `fireworks` app:

```bash
$ npx create-react-app fireworks --template typescript
```

Once the installation is complete, let's add a few packages we'll use throughout the app with this command:

```bash
$ npm i animejs @types/animejs @mui/material @emotion/react @emotion/styled
```

Now let's jump into the first component we need to make.

## Make the fireworks component

We're going to have two main components: one for the fireworks animation and one for the form users will be able to customize the fireworks with. Let's start with the fireworks component. In the `src` directory, create a new folder called `components`. Inside this new folder, add a file and name it `Fireworks.tsx`. This is where we'll have all of the code for the fireworks animation.

Go ahead and open that file and add the following code and then we'll go through it all:

```javascript
// Fireworks.tsx
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import anime from "animejs";
import { useState, useRef, useEffect } from "react";
import "../Fireworks.css";
import CustomizeForm from "./CustomizeForm";

export interface CustomizationProps {
  color: string;
  size: number;
  duration: number;
  sparkAmount: number[];
  rows: number[];
}

const Fireworks = () => {
  const [customizations, setCustomizations] =
    useState <
    CustomizationProps >
    {
      color: "bf6d20",
      size: 450,
      duration: 150,
      sparkAmount: Array.from(Array(10)),
      rows: Array.from(Array(3)),
    };

  const animation = useRef(null);

  const handleClick = () => {
    // @ts-ignore
    animation.current.play();
  };

  useEffect(() => {
    // @ts-ignore
    animation.current = anime.timeline({
      direction: "alternate",
      duration: customizations.duration,
      autoplay: false,
      easing: "easeInOutSine",
    });

    // @ts-ignore
    animation.current.add(
      {
        targets: `.dots li`,
        translateX: anime.stagger(10, {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
          axis: "x",
        }),
        translateY: anime.stagger(10, {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
          axis: "y",
        }),
        rotateZ: anime.stagger([0, 90], {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
          axis: "x",
        }),
        delay: anime.stagger(200, {
          grid: [customizations.rows.length, customizations.sparkAmount.length],
          from: "center",
        }),
        easing: "easeInOutQuad",
      },
      Math.random() * customizations.duration
    );
  }, [customizations]);

  return (
    <Container>
      <CustomizeForm
        customizations={customizations}
        setCustomizations={setCustomizations}
      />
      <div className="player">
        {customizations.rows.map((_, i) => (
          <ul className="dots">
            {customizations.sparkAmount.map((_, i) => (
              <li
                style={{
                  backgroundColor: `#${customizations.color}`,
                  height: `${customizations.size + Math.random() * 3}px`,
                  maxHeight: "100%",
                  maxWidth: "100%",
                  width: `${customizations.size}px`,
                }}
                key={i}
              />
            ))}
          </ul>
        ))}
        <Button variant="contained" color="success" onClick={handleClick}>
          Play
        </Button>
      </div>
    </Container>
  );
};

export default Fireworks;
```

We start off by importing everything we need. There's some stuff coming from third party packages and we have a couple imports we'll define as we go through this app. You'll notice there's a custom stylesheet and another component called `CustomizeForm`. We'll get to these a little later.

For now, we'll move on and define the types for the options users will be able to change for the animation. They'll be able to play with the duration of the animation, the color of the fireworks, how many there are, and how big they are. Next, we start defining what happens in the component.

We define a new state variable with some default values to define the initial layout of the fireworks. Then we define a reference to an element that the animation will render in. After that, the `handleClick` method is defined which will play the animation any time a button is clicked.

Now we're at the fun part. The `useEffect` hook is where we actually define the animation. We set `animation.current` to follow a `timeline`. You can see where that `customizations` state is being used to update the animation duration when a user changes it. Then we add an animation for each of elements in the `.dots` class.

Next, we define what types of translations and rotations should happen to all of the fireworks elements. Every time the user updates a value, we'll be able to see the change in the fireworks.

Finally, we get to define the `render` method which has all of these elements we've been talking about. Again, we don't have the `CustomizeForm` component yet, but we will in just a bit. For the most part, we're making a grid the size that the user defines it. There are some CSS values that get changed dynamically and the play button. Then we're done with the `Fireworks` component!

Now let's define some styles for those classes we have.

### Add the CSS

In the root of the app, add a new file called `Fireworks.css`. Then add the following code inside it:

```css
/* Fireworks.css */
.player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dots {
  display: flex;
  align-items: center;
  list-style: none;
  height: 100px;
  padding: 0;
  margin-top: 30px;
  width: 100%;
}

.dots li {
  border-radius: 2px;
  margin: 0 2px;
}
```

These are the classes we defined on the grid in our `Fireworks` component. They clean up some container configurations that can be done with MUI, but can be easier to implement with plain CSS. Those were the only styles we needed so we're good to go here.

### Get user input

Now let's make that `CustomizeForm` component that lets users make changes to the fireworks. In the `components` folder, add a new file called `CustomizeForm.tsx`. Add the following code to this file:

```javascript
// CustomizeForm.tsx
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { CustomizationProps } from "./Fireworks";

interface CustomizeFormProps {
  customizations: CustomizationProps;
  setCustomizations: (options: CustomizationProps) => void;
}

export default function CustomizeForm({
  customizations,
  setCustomizations,
}: CustomizeFormProps) {
  function updateFireworks(e: any) {
    e.preventDefault();

    const { color, size, duration, sparkAmount, rows } = customizations;

    const newValues = {
      color: e.currentTarget.color.value || color,
      size:
        e.currentTarget.size.value !== ""
          ? Number(e.currentTarget.size.value)
          : size,
      duration:
        e.currentTarget.duration.value !== ""
          ? Number(e.currentTarget.duration.value)
          : duration,
      sparkAmount:
        e.currentTarget.sparkAmount.value !== ""
          ? Array.from(Array(Number(e.currentTarget.sparkAmount.value)))
          : sparkAmount,
      rows:
        e.currentTarget.rows.value !== ""
          ? Array.from(Array(Number(e.currentTarget.rows.value)))
          : rows,
    };

    setCustomizations(newValues);
  }

  return (
    <Container>
      <form
        onChange={(e) => updateFireworks(e)}
        style={{ marginBottom: "24px", marginTop: "24px", width: "800px" }}
      >
        <Stack spacing={2}>
          <TextField id="color" label="Color" variant="standard" name="color" />
          <TextField id="size" label="Size" variant="standard" name="size" />
          <TextField
            id="sparkAmount"
            label="Number of sparks"
            variant="standard"
            name="sparkAmount"
          />
          <TextField
            id="rows"
            label="Number of firework rows"
            variant="standard"
            name="rows"
          />
          <TextField
            id="duration"
            label="Duration"
            variant="standard"
            name="duration"
          />
        </Stack>
      </form>
    </Container>
  );
}
```

This is a basic form with some input fields that triggers a state change. We import the packages like usual and we also import a type from the `Fireworks` component to define the options users change. Then we define the props this component expects which are the state variable and method we made in the `Fireworks` component.

Next is the component itself. It looks like a lot more is happening than it really is. The `updateFireworks` function is getting the form values and defaulting to the existing `customizations` values if users do change them. Then it updates the state which will re-render the `Fireworks` elements with these new values.

At the end, we have the `form` with the five options users can change for their fireworks. Any time a value is changed, it triggers a form event to call the `updateFireworks` function with the new values. That's all for the user form! Now let's make the last update to show all of this work in the browser.

### Update the `App.tsx` file

Open `App.tsx` and delete everything out of it. This is where we're going to show our fireworks and the form in action. Add the following code to the file:

```javascript
// App.tsx
import Fireworks from "./components/Fireworks";

function App() {
  return <Fireworks />;
}

export default App;
```

Now all of that behind-the-scenes work will finally be shown to users. If you run the app with `npm start`, you should see something like this now:

![finished app](https://res.cloudinary.com/mediadevs/image/upload/v1656079907/e-603fc55d218a650069f5228b/ujg3cue3apsdz90v0ogj.png)

That's it! Now we're done with this little fireworks animation and you can start diving deeper into this library.

## Finished code

You can check out all of the code in the `qr-card` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/fireworks). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/pedantic-babbage-hb0pw6).

<CodeSandBox
  title="pedantic-babbage-hb0pw6"
  id="pedantic-babbage-hb0pw6"
/>

## Conclusion

There are several good animation packages out there for JavaScript apps like, [three.js](https://threejs.org/), [velocity.js](http://velocityjs.org/), and [GSAP](https://greensock.com/gsap/). It doesn't hurt to do a little research into all of them if you know you're going to be working with browser animations. Most of them have great documentation and examples so you should be able to get up and running with any of them.
