const socket = io();

let map;
let busMarkers = {};

const stops = [
{lat:8.8922,lng:78.1707,name:"Tharuvaikulam"},
{lat:8.7929,lng:78.1424,name:"Samathuvapuram"},
{lat:8.7929,lng:78.1424,name:"Komeshpuram"},
{lat:8.824,lng:78.165,name:"Thalamuthunagar"},
{lat:8.8167,lng:78.1333,name:"T.Saveriyarpuram"},
{lat:8.8300,lng:78.1445,name:"Sottayanthoppu"},
{lat:8.7929,lng:78.1424,name:"Arokyapuram"},
{lat:8.8191,lng:78.1480,name:"Vattakovil"},
{lat:8.8140,lng:78.1469,name:"American Hospital"},
{lat:8.8346,lng:78.1411,name:"Karupatti Society"},
{lat:8.8157,lng:78.1479,name:"Kandasamypuram"},
{lat:8.8044,lng:78.1406,name:"Old Bus Stand"},
{lat:8.7517,lng:78.1289,name:"Bolden Puram"},
{lat:8.7902,lng:78.1322,name:"Bryant Nagar"},
{lat:8.8012,lng:78.1211,name:"Millerpuram"},
{lat:8.7906,lng:78.1155,name:"3rd Mile"},
{lat:8.7375,lng:78.0370,name:"College"},

];

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