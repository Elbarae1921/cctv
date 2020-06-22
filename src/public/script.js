// initialize the FPS var
let FPS = 20;

// initialize the frames array
const frames = [];

// boolean to check if the frames array is empty
let load = true;

// initialize the isPaused variable for pause functionality
let isPaused = false;

// get the image element
const image = document.getElementById("image");

// get the loading spinner
const loading = document.getElementById("loading");

// get the pause icon div
const pause = document.getElementById("pause");

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

// image pause onclick
image.onclick = () => {
    isPaused = !isPaused;
    pause.style.display = isPaused ? "flex" : "none";
};

// pause onclick event since the image would be hidden
pause.onclick = () => {
    isPaused = !isPaused;
    pause.style.display = isPaused ? "flex" : "none";
};

// function to display frames at a 1000/FPS frame per second ratio
setInterval(() => {
    // check if is paused
    if(!isPaused) {
        // check if the frames array was empty the last time
        if(load) {
            // check if the frames array contains enough frames, otherwise wait for it to fill
            if(frames.length >= FPS) {
                loading.style.display = "none";
                image.src = `data:image/jpeg;base64,${frames.shift()}`;
                load = false;
            }
        }
        else {
            // check if the frames array is not empty
            if(frames.length != 0) {
                loading.style.display = "none";
                image.src = `data:image/jpeg;base64,${frames.shift()}`;
            }
            else {
                loading.style.display = "flex";
                load = true;
            }
        }
    }       
}, 1000 / FPS);