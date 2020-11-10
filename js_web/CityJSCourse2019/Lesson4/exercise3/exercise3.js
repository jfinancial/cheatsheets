
// Variables used by script.
// We need references to the textarea, the button and the div to place the results in
var userInput = document.getElementById('user-input'),
    saveButton = document.getElementById('btn'),
    resultEl = document.getElementById('saved-text');

// Helper function to help keep code clean...
// All it does is make a button element, which we then add to each of the p 
// elements we add to the page
function makeMasterDeleteButton() {
    var btn = document.createElement('a');
    btn.textContent = 'X';
    btn.classList.add('item-delete'); // give button the class "item-delete"
    btn.setAttribute('href', '#');
    return btn;
}


// Make sure we have valid elements to work with
if (userInput !== null && saveButton !== null && resultEl !== null) {

    // Listen for clicks on form button
    saveButton.addEventListener('click', function (event) {

        var newNode, // Element we will create
            itemDeleteButton, // Delete button for element
            submitted = userInput.value; // Text from form field

        // Check if user entered something
        if (submitted !== '') {

            // Make a p element and add the submitted text to it
            newNode = document.createElement('p');
            newNode.textContent = submitted;

            // Make a delete button element and append it to p element
            itemDeleteButton = makeMasterDeleteButton();
            newNode.insertAdjacentElement('afterbegin', itemDeleteButton);

            // add the p element to the page
            resultEl.appendChild(newNode);

            // Erase user's text from the textarea
            userInput.value = '';
        }

        // Stop the browser's default behaviour. By default, when a "button" within a "form"
        // element is clicked, the form gets submitted, resulting in a page reload (which we don't want)
        event.preventDefault();
    });

    // Add event listener for item deletions here...

}

