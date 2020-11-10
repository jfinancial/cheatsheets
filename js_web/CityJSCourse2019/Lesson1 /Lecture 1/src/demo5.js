// Look up element with id: content
var content = document.getElementById('content');
if (content !== null) {
  var pElements =  content.querySelectorAll('p');
  console.log(pElements);
}