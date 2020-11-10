function getx(x) {
    this.x = x;
}

getx(5);

console.log(window.x);

var y = new getx(6);

console.log(window.x);