
var VatCalculator = (function () {
    var rate = 20, vatEvent, raiseVat, etc;
    // Create the event object, adding
    // the "rate" to the "detail" object
    vatEvent = new CustomEvent("VatRaised", {
        "detail": {
            "rate": rate
        }
    }
    );
    // Other methods omitted for clarity...
})();

var VatCalculator = (function () {
    // Other stuff omitted for clarity..
    raiseVat = function (amount) {
        rate = rate + amount;
        // Rate has changed:
        // so update value in event object
        vatEvent.detail.rate = rate;
        // Now fire the event... with updated value
        document.dispatchEvent(vatEvent);
    };
    // Other stuff omitted for clarity...
})();


// Event is dispatched from "document"
// so we add handler to "document"
document.addEventListener(
    "VatRaised",
    function (event) {
        // get the new rate from detail object
        var newVat = event.detail.rate;
        // Pass rate value to function
        updateVatDisplay(newVat);
    }
);