// initialize the FPS var
let FPS = 20;

// initialize the frames array
const frames = [];

// boolean to check if the frames array is empty
let load = true;

// get the image element
const image = document.getElementById("image");

// get the loading spinner
const loading = document.getElementById("loading");

// connect to the socket server
const socket = io.connect("http://localhost:5000");

// when the server emits the FPS value
socket.on("init", fps => {
    FPS = fps;
});

// whenever the client recieves a new image
socket.on("image", (image64) => {
    // update the image source with the recieved base64 string
    // image.src = `data:image/jpeg;base64,${image64}`;
    frames.push(image64);
});

setInterval(() => {
    if(load) {
        if(frames.length >= FPS) {
            loading.style.display = "none";
            image.src = `data:image/jpeg;base64,${frames.shift()}`;
            load = false;
        }
    }
    else {
        if(frames.length != 0) {
            loading.style.display = "none";
            image.src = `data:image/jpeg;base64,${frames.shift()}`;
        }
        else {
            loading.style.display = "flex";
            load = true;
        }
    }    
}, 1000 / FPS);