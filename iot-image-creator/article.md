# Using IoT to Create Images

Every now and then it's fun to work with hardware using JavaScript. There are an incredible number of applications you can make with IoT devices like Arduinos or Rasberry Pis. That's why we're going to play with an Arduino project in this post!

We're going to use a photoresistor sensor to draw pictures in a JavaScript app. Then we'll upload those pictures to Cloudinary so we can monitor the images for any drastic changes in the input we get from the sensor.

## Setting up the Arduino

For this project, you'll need:

- an Arduino Uno
- this sensor
- a breadboard
- some wires
- a power source

To get started with the hardware, you'll need the [Arduino IDE](https://www.arduino.cc/en/software). Then you'll need to hook your Arduino up to your computer and install the Firmata code that will let us interact with it from the JavaScript app. You can find the [code for to paste into the IDE here](https://docs.arduino.cc/hacking/software/FirmataLibrary).

Then in the Arduino IDE, go to `Sketch > Upload` and this should allow you to upload the Firmata code to the Arduino. Make sure you check which port your board is on. You'll need this for when we set up the server for the app. Now we have what we need to interface with the JavaScript app. Now let's turn our attention to setting up the hardware.

### Wiring the Arduino and breadboard

We need to connect the sensor to the board correctly so we get the data reading into our app. Here's a picture of the setup. Feel free to organize the wires in a different way as long as the connections are correct!

![the sensor hooked up to the Arduino and breadboard]()

Since we have the hardware setup, let's turn our attention to the app.

## Building the JavaScript app

We'll have a little Node server to get the data from the sensor and we'll have a front-end to display the visualization. For once, we're not going to use a framework! Do you remember plain old `html`, `css`, and `js` files in a folder? Before we get to that, let's build the server-side first.

### Setting up the connection to the Arduino

In a folder, create a new file called `server.js`. This is where we'll write the code to get the data from the sensor and send it to the front-end. So we'll need to install a few packages. In your terminal, run the following command:

```bash
$ npm i express cors johnny-five
```

The `express` and `cors` libraries will let us create the REST endpoint that the front-end will retrieve the sensor data from. The `[johnny-five` library](http://johnny-five.io/) is this awesome package that lets us interact with the Arduino board. You should definitely check it out if you're interested in IoT and you want to make JavaScript apps.

In the `server.js` file, add the following code to start setting up the app.

```js
const five = require("johnny-five");
const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const board = new five.Board({ port: "/dev/ttyUSB3" });
let photoresistor = {}
```

We're importing the packages we installed just a bit ago and add a few variables. The most important part to note is the `board` variable. Make sure you update this to the port address for your Arduino board. If it's not in the `/dev/ttyUSB#` format, it might also be in a format similar to this `/dev/tty.usbmodem####` or `COM#`.

Now we can start getting data from the board.

### Getting the sensor data

In order to get the sensor data, we need to connect to the correct pin on the board in our code. To do that, add the following code below our imports and variable declarations so far.

```js
board.on("ready", function() {
// Create a new `photoresistor` hardware instance.
    photoresistor = new five.Sensor({
        pin: "A2",
        freq: 250
    });

    // Inject the `sensor` hardware into
    // the Repl instance's context;
    // allows direct command line access
    board.repl.inject({
        pot: photoresistor
    });
});
```

This is going to connect the board to the app when it's on and ready to send us data. Then it'll read then input from the sensor at pin A2. There's the ability to interact with the sensor in the command line in case you want to play with the values there, like the frequency.

Next we need to add the endpoint where we send the data to the front-end. Add the following code right below our board method.

```js
app.get('/api/getSensorData', (req, res) => {
    let data = {}
    // "data" get the current reading from the photoresistor
    photoresistor.on("data", function() {
        console.log(this.value);
        data = this.value
    });

   res.send({
       message: data
   });
});

app.listen(PORT, () => {
 console.log(`endpoints running on port ${PORT}`);
});
```

This code lets us get the photoresistor data and send it to the console and to the front-end as the response for this `getSensorData` endpoint. The last thing we need to do on the back-end is start up the server. That's what is happening with the `app.listen` method. You can set a port number in a `.env` file or you can let it default to port 3000.

The last piece of this project is the front-end where we can visualize the sensor data.

## Making a simple front-end

We're going to build this front-end without a framework for once because not everything needs a framework. We will use a few different packages to help us make something interesting to look at with this data. In your project folder, create a sub-folder called `client`. Inside this folder, create a `client.html` file and a `client.js` file. If you want to play with style more, go ahead and add a `client.css` file.

Let's start in the `html` file. Do you remember when we used to import packages directly in HTML in the `<script>` tags? That's what we'll be doing again. Let's start with a skeleton of the HTML that we'll fill in.

```html
<!DOCTYPE html>
<html>
   <head>
       <link rel="stylesheet" href="./client.css">
       <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js"></script>
       <script src="https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.9.0/html-to-image.js" integrity="sha512-8GQQGLSN+MYJfxnTNZm8HPIXz9TkAMeRcadyQO/oFsk+OAHOH7uTz5dAafi1ADICwul44a3JpV2vsolsjVeVGg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
       <title>Real World Visuals</title>
   </head>
   <body>
       <header>This visualization is coming directly from sensor data.</header>
       <main>
           <canvas id="sensorVisual" width="500"></canvas>
       </main>
       <script src="./client.js"></script>
   </body>
</html>
```

There are a few elements in here that import the stylesheet if you choose to have it and the package for [ChartJS](https://www.chartjs.org/docs/latest/) so that we can make a visualization out of this data over time and the [html-to-image](https://www.npmjs.com/package/html-to-image) package that will let us take the snapshot that we'll upload to Cloudinary. There's some text and a canvas on the page and a `<script>` that brings in the `client.js`.

### Visualizing the data

We'll be doing the rest of the work in the `client.js` file so go ahead and open that. Let's start by fetching the data when the page is loaded by adding the following code.

```js
window.onload = async () => {
    const ctx = document.getElementById('sensorVisual').getContext('2d')
    
    let data = await fetch('https://localhost:3000/api/getSensorData') 
}
```

This will retrieve the sensor data from the endpoint we created earlier. Now let's add a chart to make a simple visualization of the sensor data. Add the following code right below the request we just made.

```js
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: data.x,
        datasets: [{
            label: 'sensor',
            data: data.y,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})
```

This creates a new `Chart` object that attaches to the canvas element. We're going to go with a bar graph because the data we receive works in this format. You could make this data work with a different type of chart as well. In the `data` prop, we use the data values we receive from the back-end to fill in the chart. To give the graph an accurate scale, we set the option to start the y-axis at zero.

If you open the `client.html` in your browser, you should see something like this.

![bar chart of the sensor data]()

All that's left is uploading this to Cloudinary!

### Uploading the visualization

The last bit of code we need is to get the canvas element, convert it to an image and send it to our Cloudinary account. The one thing you'll need is your account `cloudName` so that you can upload to the correct location. Let's add this code right below the chart object.

```js
const canvas = document.getElementById('sensorVisual')

const dataUrl = await toPng(canvas, { cacheBust: true })

const uploadApi = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

const formData = new FormData()
formData.append('file', dataUrl)
formData.append('upload_preset', 'cwt1qiwn')

await fetch(uploadApi, {
    method: 'POST',
    body: formData,
})
```

Now when you load the page, it'll take a snapshot of the data you're receiving from the sensor connected to your Arduino board!

## Finished code

If you want to check out the finished code, you can go to [the `iot-image-generator` in this repo](https://github.com/flippedcoder/media-projects/tree/main/iot-image-creator). It might take a bit of troubleshooting to get the code working with the baord so make sure to check out the [Arduino docs](https://docs.arduino.cc/hardware/uno-rev3) and the [Johnny-Five docs](http://johnny-five.io/api/boards/).

## Conclusion

This might seem like a fun little application, but there are sensors in different industries that do this exact thing in a similar manner. Getting sensor data and passing it through a web app at some point isn't the most common kind of work, but it's definitely an interesting type of work.