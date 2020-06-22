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

// get the refresh button from the DOM
const refresh = document.getElementById("refresh");

// get the refresh button's parent elemtn
const live = document.getElementById("live");

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
    isPaused = true;
    pause.style.display = "flex";
    live.style.display = "none";
};

// pause onclick event since the image would be hidden
pause.onclick = () => {
    isPaused = false;
    pause.style.display = "none";
    live.style.display = "flex";
};

// live onclick to refresh the stream
refresh.onclick = () => {
    frames.length = 0;
}

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
                if(frames.length > FPS*2) {
                    live.style.display = "flex";
                }
                else {
                    live.style.display = "none";
                }
            }
        }
        else {
            // check if the frames array is not empty
            if(frames.length != 0) {
                loading.style.display = "none";
                image.src = `data:image/jpeg;base64,${frames.shift()}`;
                if(frames.length > FPS*2) {
                    live.style.display = "flex";
                }
                else {
                    live.style.display = "none";
                }
            }
            else {
                loading.style.display = "flex";
                live.style.display = "none";
                load = true;
            }
        }
    }       
}, 1000 / FPS);