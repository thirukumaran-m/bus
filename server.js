const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let buses = {};
let stopHistory = {};

io.on("connection",(socket)=>{

// send old stop history when passenger open page
socket.emit("stopHistory",stopHistory);

socket.on("busLocation",(data)=>{

io.emit("busLocation",data);

buses[data.busId] = {
lat:data.lat,
lng:data.lng
};

io.emit("busUpdate",buses);

});

// save stop arrival time
socket.on("stopArrived",(data)=>{

stopHistory[data.stop] = data.time;

io.emit("stopHistory",stopHistory);

});

// RESET stops when driver start new trip
socket.on("resetStops",()=>{

stopHistory = {};

io.emit("stopHistory",stopHistory);

});

});

const PORT = process.env.PORT || 3000;

http.listen(PORT,()=>{
console.log("Server running on "+PORT);
});