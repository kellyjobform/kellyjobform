// Select the form element
const form = document.getElementById('applicationForm');

// Add an event listener for form submission
form.addEventListener('submit', function(event) {
    // Basic client-side validation
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    if (!firstName || !lastName || !validateEmail(email)) {
        alert('Please fill in all required fields with valid information.');
        event.preventDefault();
        return;
    }
});

// Function to validate email addresses
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}
