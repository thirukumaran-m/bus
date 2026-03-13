const socket = io();

let map;
let busMarkers = {};
function initMap(){

map = new google.maps.Map(document.getElementById("map"),{
zoom:13,
center:stops[0]
});

stops.forEach(stop=>{
new google.maps.Marker({
position:stop,
map:map,
title:stop.name,
icon:"http://maps.google.com/mapfiles/ms/icons/green-dot.png"
});
});

const route = new google.maps.Polyline({
path:stops,
geodesic:true,
strokeColor:"#FF0000",
strokeOpacity:1.0,
strokeWeight:4
});

route.setMap(map);

}

socket.on("busUpdate",(buses)=>{

for(let id in buses){

let bus = buses[id];

if(!busMarkers[id]){

busMarkers[id] = new google.maps.Marker({
position:bus,
map:map,
label:id,
icon:"https://maps.google.com/mapfiles/kml/shapes/bus.png"
});

}else{

animateBus(busMarkers[id],bus);

}

}

});
function calculateETA(bus,stop){

let distance = google.maps.geometry.spherical.computeDistanceBetween(
new google.maps.LatLng(bus.lat,bus.lng),
new google.maps.LatLng(stop.lat,stop.lng)
);

let speed = 30;

let eta = distance/1000/speed*60;

return eta.toFixed(1);

}
function animateBus(marker, newPosition){

let start = marker.getPosition();

let startLat = start.lat();
let startLng = start.lng();

let endLat = newPosition.lat;
let endLng = newPosition.lng;

let steps = 50;
let count = 0;

let deltaLat = (endLat - startLat) / steps;
let deltaLng = (endLng - startLng) / steps;

let interval = setInterval(function(){

count++;

let lat = startLat + deltaLat * count;
let lng = startLng + deltaLng * count;

marker.setPosition({lat:lat,lng:lng});

if(count >= steps){
clearInterval(interval);
}

},50);

}
//show bus status
function getBusStatus(oldPos,newPos){

if(oldPos.lat === newPos.lat && oldPos.lng === newPos.lng){

return "Stopped";

}else{

return "Moving";

}

}
let status = getBusStatus(previousPosition,newPosition);

document.getElementById("etaBox").innerHTML =
"Bus Status: " + status;
//show distance from bus stop
function getDistance(lat1,lng1,lat2,lng2){

let R = 6371;

let dLat = (lat2-lat1) * Math.PI/180;
let dLng = (lng2-lng1) * Math.PI/180;

let a =
Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLng/2) * Math.sin(dLng/2);

let c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R * c;

}
//bus arrival notification
if(distance < 0.2){

alert("Bus arriving at next stop!");

}