function login() {
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;
    
    // Call the authenticate function
    if (authenticate(username, password)) {
        document.getElementById("message").innerText = "Welcome, " + username + "!";
    } else {
        document.getElementById("message").innerText = "Authentication failed. Please try again.";
    }
}

function createUser() {
    var username = document.getElementById("createUsername").value;
    var password = document.getElementById("createPassword").value;
    
    // Call the saveCredentials function
    saveCredentials(username, password);
    document.getElementById("message").innerText = "User " + username + " created successfully.";
}

function authenticate(username, password) {
    var credentials;
    try {
        credentials = JSON.parse(localStorage.getItem('credentials'));
    } catch (err) {
        // JSON parse error or credentials not found
    }

    if (credentials && credentials.hasOwnProperty(username) && credentials[username] === password) {
        return true;
    } else {
        return false;
    }
}

function saveCredentials(username, password) {
    var credentials = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials')) : {};
    credentials[username] = password;
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

document.getElementById("action").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        var action = document.getElementById("action").value;
        if (action === 'l') {
            document.getElementById("loginForm").style.display = "block";
            document.getElementById("createForm").style.display = "none";
        } else if (action === 'c') {
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("createForm").style.display = "block";
        } else {
            document.getElementById("message").innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
        }
    }
});
