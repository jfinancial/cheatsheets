var VatCalculator = (function() { 

    var rate = 20, 
        raiseVat, 
        calcVat, 
        addVat, 
        getRate; 
    
    raiseVat = function (amount) {
        rate = rate + amount;
    };
    
    calcVat = function (nett) {
        return (rate / 100) * nett;
    };
    
    addVat = function (num) {
        return num + calcVat(num);
    };
    
    getRate = function () {
        return rate;
    };
    
    return {
        get: getRate,
        add: addVat,
        increase: raiseVat
    }; 
})();
