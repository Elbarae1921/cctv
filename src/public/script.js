// get the image element
const image = document.getElementById("image");

// connect to the socket server
const socket = io.connect("http://localhost:5000");

// whenever the client recieves a new image
socket.on("image", image64 => {
    // update the image source with the recieved base64 string
    image.src = `data:image/jpeg;base64,${image64}`;
})