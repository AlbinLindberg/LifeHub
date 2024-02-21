function login() {
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;
    
    // Call the authenticate function
    if (authenticate(username, password)) {
        document.getElementById("message").innerText = "Welcome, " + username + "!";
        document.getElementById("loggedInOptions").style.display = "block"; // Show delete user button
        loadUserActivities(username);
    } else {
        document.getElementById("message").innerText = "Authentication failed. Please try again.";
        document.getElementById("loggedInOptions").style.display = "none"; // Hide delete user button
    }
}

function createUser() {
    var username = document.getElementById("createUsername").value;
    var password = document.getElementById("createPassword").value;
    
    // Call the saveCredentials function
    saveCredentials(username, password);
    document.getElementById("message").innerText = "User " + username + " created successfully.";
}

function deleteUser() {
    var username = document.getElementById("loginUsername").value; // Assuming username is still available
    var credentials = JSON.parse(localStorage.getItem('credentials'));
    delete credentials[username];
    localStorage.setItem('credentials', JSON.stringify(credentials));
    document.getElementById("message").innerText = "User " + username + " deleted successfully.";
    document.getElementById("loggedInOptions").style.display = "none"; // Hide delete user button
}

function authenticate(username, password) {
    var credentials;
    try {
        credentials = JSON.parse(localStorage.getItem('credentials'));
    } catch (err) {
        // JSON parse error or credentials not found
    }

    if (credentials && credentials.hasOwnProperty(username) && credentials[username].password === password) {
        return true;
    } else {
        return false;
    }
}

function saveCredentials(username, password) {
    var credentials = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials')) : {};
    credentials[username] = {password: password, data: []}; // Modified to store activities as an array
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

function saveActivity() {
    var username = document.getElementById("loginUsername").value; // Assuming username is still available
    var activityDate = document.getElementById("activityDate").value;
    var activityTime = document.getElementById("activityTime").value;
    var activityDescription = document.getElementById("activityDescription").value;
    
    var credentials = JSON.parse(localStorage.getItem('credentials'));
    credentials[username].data.push({
        date: activityDate,
        time: activityTime,
        description: activityDescription
    });
    localStorage.setItem('credentials', JSON.stringify(credentials));
    loadUserActivities(username); // Reload user's activities after saving
}

function deleteActivity(username, index) {
    var credentials = JSON.parse(localStorage.getItem('credentials'));
    
    if (credentials && credentials.hasOwnProperty(username)) {
        credentials[username].data.splice(index, 1);
        localStorage.setItem('credentials', JSON.stringify(credentials));
        loadUserActivities(username); // Reload user's activities after deletion
        document.getElementById("message").innerText = "Activity deleted successfully.";
    } else {
        document.getElementById("message").innerText = "Failed to delete activity.";
    }
}

function loadUserActivities(username) {
    var credentials = JSON.parse(localStorage.getItem('credentials'));
    var userActivities = credentials[username].data;
    var message = "User " + username + "'s saved activities:<br>";
    userActivities.forEach(function(activity, index) {
        message += "<button onclick='deleteActivity(\"" + username + "\", " + index + ")'>Delete</button> Date: " + activity.date + ", Time: " + activity.time + ", Description: " + activity.description + "<br>";
    });
    document.getElementById("message").innerHTML = message;
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



