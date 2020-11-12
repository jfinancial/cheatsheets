function easyHTTP() {
  this.http = new XMLHttpRequest();
}

// Make an HTTP GET Request
easyHTTP.prototype.get = function(url, callback) {
  this.http.open('GET', url, true);
  let self = this;  //we do this because function doesn't have a this (fixed in arrow functions which proivide a lexical this)
  this.http.onload = function() {
    if(self.http.status === 200) {
      callback(null, self.http.responseText);  //we pass in the response text to the callback so it only populates once the response returns
    } else {
      callback('Error: ' + self.http.status);
    }
  }

  this.http.send();
}

// Make an HTTP POST Request
easyHTTP.prototype.post = function(url, data, callback) {
  this.http.open('POST', url, true);
  this.http.setRequestHeader('Content-type', 'application/json');
  let self = this;   //we do this because function doesn't have a this (fixed in arrow functions which proivide a lexical this)
  this.http.onload = function() {
    callback(null, self.http.responseText);  //we pass in the response text to the callback so it only populates once the response returns
  }

  this.http.send(JSON.stringify(data));
}


// Make an HTTP PUT Request
easyHTTP.prototype.put = function(url, data, callback) {
  this.http.open('PUT', url, true);
  this.http.setRequestHeader('Content-type', 'application/json');
  let self = this;   //we do this because function doesn't have a this (fixed in arrow functions which proivide a lexical this)
  this.http.onload = function() {
    callback(null, self.http.responseText);  //we pass in the response text to the callback so it only populates once the response returns
  }

  this.http.send(JSON.stringify(data));
}

// Make an HTTP DELETE Request
easyHTTP.prototype.delete = function(url, callback) {
  this.http.open('DELETE', url, true);

  let self = this;
  this.http.onload = function() {
    if(self.http.status === 200) {
      callback(null, 'Post Deleted');
    } else {
      callback('Error: ' + self.http.status);
    }
  }

  this.http.send();
}
