const socket = io();

let map;
let busMarkers = {};

const stops = [
{lat:8.7642,lng:78.1348,name:"College"},
{lat:8.7700,lng:78.1400,name:"Library"},
{lat:8.7800,lng:78.1500,name:"Bus Stand"}
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

busMarkers[id].setPosition(bus);

}

}

});