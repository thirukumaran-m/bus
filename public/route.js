const socket = io();

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

/* receive previous stop history */

socket.on("stopHistory",(data)=>{

Object.keys(data).forEach(i=>{

arrivedStops[i] = true;

document.getElementById("status"+i).innerText="Arrived";
document.getElementById("status"+i).className="arrived";

document.getElementById("time"+i).innerText=data[i];

});

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

      socket.emit("stopArrived",{
        stop:i,
        time:time
      });

      /* next stop */

      if (stops[i + 1]) {
        document.getElementById("status" + (i + 1)).innerText = "On the Way";
        document.getElementById("status" + (i + 1)).className = "ontheway";
      }
    }
  });
}
