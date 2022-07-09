# Create a Business Card QR Code in React

In recent years, QR codes have become more popular to give out information that used to be printed. Restaurant menus, concert tickets, even documentation for getting through customs in certain countries has been moved to QR codes. They let us share that info quickly and in a sustainable manner.

One thing that hasn't gone away is the business card. LinkedIn profiles are nice, but sometimes having that custom card means a little more depending on the environment. Going to online and in-person conferences could definitely benefit from having business cards available. That's why we're going to create a QR code we can let others scan to see our business card. No more ordering hundreds of these and packing them everywhere.

## Some basic set up

First thing we need to do is create the React app we'll work with. To do that, run the following command:

```bash
$ npx create-react-app qr-card --template typescript
```

This will bootstrap a new React app for us. Next, you'll need to install the package we'll be using to generate the custom QR codes, [react-qr-code](https://www.npmjs.com/package/react-qr-code). Run the following command:

```bash
$ npm i react-qr-code
```

We'll also be using [Material UI](https://mui.com/) to style the components we'll work with so run the following command to install these dependencies:

```bash
$ npm i @mui/material @emotion/react @emotion/styled
```

This is the only set up we have to do. Let's jump into the real code.

## Make the business card input

Go to the `src` directory and add a new directory called `components`. Inside that folder, add a new file called `QrGenerator.tsx`. This is where we'll have the form to create a business card based on what users enter and we'll display the generated QR code.

Open this new file and add the following code:

```javascript
import { useState } from "react";
import QRCode from "react-qr-code";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export default function QrGenerator() {
  const [qrValue, setQrValue] = useState("placeholding");

  function generateCode(e: any) {
    e.preventDefault();

    setQrValue(`
        <div>
            <p>${e.currentTarget.fullName.value}</p>
            <p>${e.currentTarget.jobTitle.value}</p>
            <p>${e.currentTarget.shortDescription.value}</p>
            <p>${e.currentTarget.website.value}</p>
        </div>
    `);
  }

  return (
    <Container>
      <form
        onSubmit={(e) => generateCode(e)}
        style={{ marginBottom: "24px", width: "800px" }}
      >
        <Stack spacing={2}>
          <TextField
            id="fullName"
            label="Full Name"
            variant="standard"
            name="fullName"
          />
          <TextField
            id="jobTitle"
            label="Job Title"
            variant="standard"
            name="jobTitle"
          />
          <TextField
            id="shortDescription"
            label="Short Description"
            variant="standard"
            name="shortDescription"
          />
          <TextField id="email" label="Email" variant="standard" name="email" />
          <TextField
            id="website"
            label="Website"
            variant="standard"
            name="website"
          />
          <Button variant="contained" type="submit">
            Generate code
          </Button>
        </Stack>
      </form>
      <QRCode value={qrValue} style={{ display: "block", margin: "0 auto" }} />
    </Container>
  );
}
```

Now let's discuss what is happening here. First, we import all of the methods and components we need. Next, we define the `QrGenerator` component. Inside of this component, we define a new state that will update the value users will see when they scan the QR code.

From here, we create the `generateCode` function that takes the input from our business card form and updates the `qrValue` state variable. Next, we dive into the return statement where we render all of the elements.

We start with the `<form>` where we call the `generateCode` function on submission. Then we use MUI to add the fields we need for the form. So we have inputs for a name, job title, short description, email address, and website URL with a submit button at the end. The reason these fields have been chosen is because you might want to showcase different experience to people when you give them your QR code.

Finally, we display the code using the `QRCode` component from the package we imported. This takes the state that gets updated with each form submission and displays it to people that scan the code. That's all we have to do to create this custom QR code on demand! This is great for networking at conferences when you want to say something more memorable on your cards.

## Generate the QR code

Now go to the `App.tsx` file and delete all of the boilerplate code. Then add the following code to show the business card form:

```javascript
import QrGenerator from "./components/QrGenerator";

export default function App() {
  return <QrGenerator />;
}
```

This is how we display our custom component when the app starts up. You can add more formatting to the value that gets displayed or just redirect them to a URL. The main thing is that you can change the QR code value on the fly, giving you some nice flexibility in how you present your business cards to different people.

![the form and QR code](https://res.cloudinary.com/mediadevs/image/upload/v1655907838/e-603fc55d218a650069f5228b/itjgdffjghwxplj63q5t.png)

## Finished code

You can check out all of the code in the `qr-card` folder of [this repo](https://github.com/flippedcoder/media-projects/tree/main/qr-card). You can also check out the app in [this Code Sandbox](https://codesandbox.io/s/youthful-nightingale-9cj5i9).

<CodeSandBox
  title="youthful-nightingale-9cj5i9"
  id="youthful-nightingale-9cj5i9"
/>

## Conclusion

Anything that you used to print off can probably be transformed into a QR code. One thing to keep in mind is that some things do need to be printed off to give the full effect. Sometimes opening a hand-written thank you card is better than receiving a custom animated thank you through a QR code. For many thing though, people will likely appreciate not needing to carry more paper or touch more things.
