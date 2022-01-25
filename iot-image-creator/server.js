const five = require("johnny-five");
const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const board = new five.Board({ port: "COM3" });
let photoresistor = {}

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