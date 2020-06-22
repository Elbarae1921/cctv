const cv = require("opencv4nodejs");
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

// how many frames per second (too big a number might cause performance issues depending on the CPU)
const FPS = 20;

// get a video capture object
const wCap = new cv.VideoCapture(0); // 0 is the id of the facecam
const height = wCap.get(cv.CAP_PROP_FRAME_HEIGHT); // get frame height
const width = wCap.get(cv.CAP_PROP_FRAME_WIDTH);  // get frame width
// you can set the height and width of the capture like so :
// wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 500);
// wCap.set(cv.CAP_PROP_FRAME_WIDTH, 500);

// set the port
const PORT = 5000;

// initialize our app
const app = express();

// create a new server (for socket.io)
const server = http.createServer(app);

// initialize socket.io and link it to our server
const io = socketio(server);

// open the public folder
app.use(express.static(path.join(__dirname, "public")));

// our main endpoint
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// send the FPS to client upon connection
io.on("connection", socket => {
    socket.emit("init", FPS);
});

// function to send a new image through socket
const sendImage = () => {
    // read a new frame
    const frame = wCap.read();
    // create a base64 string from the image
    const image = cv.imencode(".jpg", frame).toString("base64");
    // send the string
    io.emit('image', {image64: image, width, height});
}

// execute send image every 1s divided by the number of frames per second
setInterval(sendImage, 1000 / FPS);

// start the server
server.listen(PORT, console.log.bind(this, `listening on http://localhost:${PORT}`));