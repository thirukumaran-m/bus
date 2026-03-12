const socket = io();

const busId = prompt("Enter Bus ID");

navigator.geolocation.watchPosition(function(pos){

let lat = pos.coords.latitude;
let lng = pos.coords.longitude;

socket.emit("busLocation",{
busId:busId,
lat:lat,
lng:lng
});

});