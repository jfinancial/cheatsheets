var w = document.getElementById('wrapper');
w.addEventListener('click', function (event) {
// Get textContent of clicked element
var cText = event.target.textContent;
    console.log(cText);
});

raiseVat = function (amount) {
    rate = rate + amount;
    updateVatDisplay(rate);
}