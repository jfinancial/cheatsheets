

var Holiday = function(night, pricePerNight) {
  this.night = night;
  this.pricePerNight = pricePerNight;
}


var California = new Holiday(20, 40);
var Hawai = new Holiday(30, 50);

console.log(California);

Holiday.prototype.destination = "USA";

console.log(Hawai);

// [
//   {isFar:true, destination:'london',},
//   {isFar:false, destination:'london',}
// ]

// x.filter(function(element){
//   return element.isFar === true;
// })
// =======

// var California = {
//   rooms: "2",
//   nights: "13",
//   pricePerNight: "20",
//   cityCenterDistance: "200"
// }

// var Holiday = function(
//   rooms, nights, pricePerNight, cityCenterDistance
// ) {
//   this.rooms = rooms;
//   this.nights = nights;
//   this.pricePerNight = pricePerNight;
//   this.cityCenterDistance = cityCenterDistance;
//   this.calculateTotal = function() {
//     console.log(this.nights*this.pricePerNight);
//   }
// }

// var California = new Holiday('2', '13', '20', 200); 

// // California.calculateTotal();

// // Holiday.prototype.destination = "USA";

// // console.log(California.destination);
// // >>>>>>> 0863e32c00af44d75c52e0e3e07b3a9769d2a663
