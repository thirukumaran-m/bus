const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let buses = {};

io.on("connection",(socket)=>{

socket.on("busLocation",(data)=>{

io.emit("busLocation",data);

buses[data.busId] = {
lat:data.lat,
lng:data.lng
};

io.emit("busUpdate",buses);

});

});

const PORT = process.env.PORT || 3000;

http.listen(PORT,()=>{
console.log("Server running on "+PORT);
});