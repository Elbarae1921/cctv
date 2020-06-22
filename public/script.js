// initialize the FPS var
let FPS = 20;

// initialize the frames array to store base64 strings representing frames
const frames = [];

// boolean to check if the frames array is empty
let load = true;

// initialize the isPaused variable for pause functionality
let isPaused = false;

// boolean to only set the image dimensions when necessary
let dimSet = false;

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
const socket = io();

// main function to update the image
const updateImage = () => {
    // check if is paused
    if(!isPaused) {
        // check if the frames array was empty the last time
        if(load) {
            // check if the frames array contains enough frames, otherwise wait for it to fill
            if(frames.length >= FPS) {
                // hide the loading spinner in case it's displayed
                loading.style.display = "none";
                // update the image source with a new base64 string from the frames array and remove it from the array at the same time with shift()
                image.src = `data:image/jpeg;base64,${frames.shift()}`;
                // set load to false since the frames array is filled again
                load = false;
                // check if the frames array is way behind the live stream
                if(frames.length > FPS*2) {
                    // if so make the refresh button available
                    live.style.display = "flex";
                }
                else {
                    // otherwise hide it if it's displayed
                    live.style.display = "none";
                }
            }
        }
        else {
            // check if the frames array is not empty
            if(frames.length != 0) {
                // hide the loading spinner in case it was displayed
                loading.style.display = "none";
                // update the image source with a new base64 string from the frames array and remove it from the array at the same time with shift()
                image.src = `data:image/jpeg;base64,${frames.shift()}`;
                // check if the frames array is way behind the live stream
                if(frames.length > FPS*2) {
                    // if so make the refresh button available
                    live.style.display = "flex";
                }
                else {
                    // otherwise hide it if it's displayed
                    live.style.display = "none";
                }
            }
            else { // if the frames array is empty
                // display loading spinner
                loading.style.display = "flex";
                // hide the refresh button
                live.style.display = "none";
                // set load to true (when true it will wait for the array to have enough values before resuming the)
                load = true;
            }
        }
    }       
}

// when the server emits the FPS value
socket.on("init", fps => {
    FPS = fps;
    // function to display frames at a 1000/FPS frame per second ratio
    setInterval(updateImage, 1000 / FPS);
});

// whenever the client recieves a new image
socket.on("image", ({image64, width, height}) => {
    // push the recieved base64 string to the frames array
    frames.push(image64);
    // get device width
    var screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    // check if width is less than 895 pixels
    if(screenWidth < 895 && !dimSet) {
        image.style.width = "100%";
        image.style.height = `${Math.abs(width - (Math.abs(width-screenWidth))/(height/width))}px`;
        dimSet = true;
    }
});

// image pause onclick
image.onclick = () => {
    // pause the stream
    isPaused = true;
    // display the pause icon
    pause.style.display = "flex";
    // hide the refresh button
    live.style.display = "none";
};

// pause onclick event since the image would be hidden
pause.onclick = () => {
    // resume the stream
    isPaused = false;
    // hide the pause icon
    pause.style.display = "none";
    // display the refresh button
    live.style.display = "flex";
};

// live onclick to refresh the stream
refresh.onclick = () => {
    // empty the frames array to remove old frames and treat new ones (could be done with frames.splice(0, frames.length) too)
    frames.length = 0;
}