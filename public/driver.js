const socket = io();

const busId = prompt("Enter Bus ID");

// reset old stop history when driver start new trip
socket.emit("resetStops");

navigator.geolocation.watchPosition(function (pos) {

  let lat = pos.coords.latitude;
  let lng = pos.coords.longitude;

  // display in driver page
  document.getElementById("lat").innerText = lat;
  document.getElementById("lng").innerText = lng;

  // send location to server
  socket.emit("busLocation", {
    busId: busId,
    lat: lat,
    lng: lng
  });

}, function(error){
  console.log(error);
},{
  enableHighAccuracy: true
});
