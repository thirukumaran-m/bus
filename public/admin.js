const socket = io();

socket.on("busUpdate",(buses)=>{

let html="";

for(let id in buses){

html+=`<p>${id} → ${buses[id].lat}, ${buses[id].lng}</p>`;

}

document.getElementById("busList").innerHTML=html;

});
//arrived status
const collegeLocation = {
  lat: 8.7642,
  lng: 78.1348
};
socket.on("busLocation", (data) => {

  const busLat = data.lat;
  const busLng = data.lng;

  checkCollegeReached(busLat, busLng);

});
function checkCollegeReached(busLat, busLng){

  const distance = Math.sqrt(
    Math.pow(busLat - collegeLocation.lat, 2) +
    Math.pow(busLng - collegeLocation.lng, 2)
  );

  if(distance < 0.001){
    document.getElementById("busStatus").innerText =
    "Bus Reached College";
  }

}
let lastUpdateTime = Date.now();

socket.on("busLocation",(data)=>{

  lastUpdateTime = Date.now();   // update time when GPS arrives

  document.getElementById("busStatus").innerText =
  data.busId + " On the Way";

});
setInterval(() => {

  const currentTime = Date.now();

  if (currentTime - lastLocationTime > 10000) {
    document.getElementById("busStatus").innerText =
    "Bus Status: Stopped";
  }

}, 3000);