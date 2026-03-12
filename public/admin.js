const socket = io();

socket.on("busUpdate",(buses)=>{

let html="";

for(let id in buses){

html+=`<p>${id} → ${buses[id].lat}, ${buses[id].lng}</p>`;

}

document.getElementById("busList").innerHTML=html;

});