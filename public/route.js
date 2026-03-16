const socket = io();

const stops = [
  { name: "Stop 1", lat: 8.786982, lng: 438.133763 },
  { name: "Stop 2", lat: 8.787724, lng: 438.130821 },
  { name: "Stop 3", lat: 8.789783, lng: 438.130918 },
  { name: "Stop 4", lat: 8.793298, lng: 438.130979 },
  { name: "Stop 5", lat: 8.793356, lng: 438.135546 },
];

let arrivedStops = {};

const timeline = document.querySelector(".timeline");

/* create UI */

stops.forEach((stop, i) => {
  const div = document.createElement("div");

  div.className = "stop";

  div.innerHTML = `

<div class="time" id="time${i}">--</div>

<div class="circle"></div>

<div>

<h3>${stop.name}</h3>

<p>Status : <span id="status${i}" class="waiting">Waiting</span></p>

</div>

`;

  timeline.appendChild(div);
});

/* receive bus location */

socket.on("busLocation", (data) => {
  checkStops(data.lat, data.lng);
});

/* distance function */

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* check stops */

function checkStops(busLat, busLng) {
  stops.forEach((stop, i) => {
    let distance = getDistance(busLat, busLng, stop.lat, stop.lng);

    if (distance < 0.1 && !arrivedStops[i]) {
      arrivedStops[i] = true;

      document.getElementById("status" + i).innerText = "Arrived";
      document.getElementById("status" + i).className = "arrived";

      let time = new Date().toLocaleTimeString();

      document.getElementById("time" + i).innerText = time;

      /* next stop */

      if (stops[i + 1]) {
        document.getElementById("status" + (i + 1)).innerText = "On the Way";
        document.getElementById("status" + (i + 1)).className = "ontheway";
      }
    }
  });
}
