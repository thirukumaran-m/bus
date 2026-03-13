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
navigator.geolocation.watchPosition((position)=>{

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  socket.emit("busLocation",{
    lat:lat,
    lng:lng
  });

});