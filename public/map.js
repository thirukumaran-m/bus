const socket = io();

let map;
let busMarkers = {};
const stops = [
  { lat: 8.894372, lng: 438.165717, name: "Tharuvaikulam" },
  { lat: 8.845845, lng: 438.142654, name: "Komaspuram" },
  { lat: 8.840021, lng: 438.145168, name: "Devispuram stop 1" },
  { lat: 8.839851, lng: 438.146683, name: "Devispuram stop 1" },
  { lat: 8.834528, lng: 438.144835, name: "T-Savariapuram" },
  { lat: 8.828994, lng: 438.147521, name: "Sotaianthopu" },
  { lat: 8.824866, lng: 438.147713, name: "Arockiapuram" },
  { lat: 8.819392, lng: 438.147813, name: "Vattakovil" },
  { lat: 8.817075, lng: 438.150544, name: "St.Thomas School line stop 1" },
  { lat: 8.817208, lng: 438.152632, name: "St.Thomas School line stop 2" },
  { lat: 8.814821, lng: 438.154020, name: "Karupati Society stop 1" },
  { lat: 8.814632, lng: 438.152590, name: "Karupati Society stop 2" },
  { lat: 8.814255, lng: 438.150231, name: "Karupati Society stop 3" },
  { lat: 8.813570, lng: 438.148336, name: "Amarican hospital stop 1" },
  { lat: 8.813753, lng: 438.144675, name: "Amarican hospital stop 2" },
  { lat: 8.807998, lng: 438.138880, name: "Arulraj hospital" },
  { lat: 8.800753, lng: 438.137164, name: "South police Station" },
  { lat: 8.795579, lng: 438.137469, name: "Ploden puram" },
  { lat: 8.793294, lng: 438.131077, name: "Bryant Nagar" },
  { lat: 8.795531, lng: 438.126526, name: "VOC College" },
  { lat: 8.790214, lng: 438.116157, name: "3rd Mile" },
  { lat: 8.688722, lng: 78.034417, name: "College" },
];
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: stops[0],
  });

  stops.forEach((stop) => {
    new google.maps.Marker({
      position: stop,
      map: map,
      title: stop.name,
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });
  });

  //const route = new google.maps.Polyline({
  //path:stops,
  //geodesic:true,
  //strokeColor:"#FF0000",
  //strokeOpacity:1.0,
  //strokeWeight:4
  //});

  route.setMap(map);
}

socket.on("busUpdate", (buses) => {
  for (let id in buses) {
    let bus = buses[id];

    if (!busMarkers[id]) {
      busMarkers[id] = new google.maps.Marker({
        position: bus,
        map: map,
        label: id,
        icon: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
      });
    } else {
      animateBus(busMarkers[id], bus);
    }
  }
});
function calculateETA(bus, stop) {
  let distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(bus.lat, bus.lng),
    new google.maps.LatLng(stop.lat, stop.lng),
  );

  let speed = 30;

  let eta = (distance / 1000 / speed) * 60;

  return eta.toFixed(1);
}
function animateBus(marker, newPosition) {
  let start = marker.getPosition();

  let startLat = start.lat();
  let startLng = start.lng();

  let endLat = newPosition.lat;
  let endLng = newPosition.lng;

  let steps = 50;
  let count = 0;

  let deltaLat = (endLat - startLat) / steps;
  let deltaLng = (endLng - startLng) / steps;

  let interval = setInterval(function () {
    count++;

    let lat = startLat + deltaLat * count;
    let lng = startLng + deltaLng * count;

    marker.setPosition({ lat: lat, lng: lng });

    if (count >= steps) {
      clearInterval(interval);
    }
  }, 50);
}
//show bus status
function getBusStatus(oldPos, newPos) {
  if (oldPos.lat === newPos.lat && oldPos.lng === newPos.lng) {
    return "Stopped";
  } else {
    return "Moving";
  }
}
let status = getBusStatus(previousPosition, newPosition);

document.getElementById("etaBox").innerHTML = "Bus Status: " + status;
//show distance from bus stop
function getDistance(lat1, lng1, lat2, lng2) {
  let R = 6371;

  let dLat = ((lat2 - lat1) * Math.PI) / 180;
  let dLng = ((lng2 - lng1) * Math.PI) / 180;

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
//bus arrival notification
if (distance < 0.2) {
  alert("Bus arriving at next stop!");
}
