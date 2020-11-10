var holidayProto = {
    calculate: function() {
        console.log(this.nights*this.pricePerNight);
    }
}

var california = Object.create(holidayProto);
california.nights = 20;
california.pricePerNight = 30;



var newyork = Object.create(holidayProto, 
{
    nights: {value:'20'},
    pricePerNight: {value:'30'}
});