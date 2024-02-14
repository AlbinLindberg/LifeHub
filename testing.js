const fs = require('fs');
const readline = require('readline');

// Function to save usernames and passwords to a JSON file
function saveCredentials(username, password) {
    // Load existing credentials file if it exists
    let credentials = {};
    try {
        credentials = JSON.parse(fs.readFileSync('credentials.json'));
    } catch (err) {
        // File does not exist or is invalid JSON, ignore
    }

    // Add new credentials
    credentials[username] = password;

    // Save updated credentials to file
    fs.writeFileSync('credentials.json', JSON.stringify(credentials, null, 4));

    console.log(`User ${username} created successfully.`);
}

// Function to authenticate user
function authenticate(username, password) {
    let credentials = {};
    try {
        credentials = JSON.parse(fs.readFileSync('credentials.json'));
    } catch (err) {
        // File does not exist or is invalid JSON
        console.error("Error: Unable to read credentials file.");
        return false;
    }

    if (credentials.hasOwnProperty(username) && credentials[username] === password) {
        console.log("Login successful!");
        return true;
    } else {
        console.log("Incorrect username or password.");
        return false;
    }
}

// Interface for user interaction
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Do you want to login (l) or create a new user (c)? ', (answer) => {
    if (answer === 'l') {
        rl.question('Enter username: ', (username) => {
            rl.question('Enter password: ', (password) => {
                if (authenticate(username, password)) {
                    // User authenticated, perform actions here
                    console.log("Welcome, " + username + "!");
                } else {
                    console.log("Authentication failed. Please try again.");
                }
                rl.close();
            });
        });
    } else if (answer === 'c') {
        rl.question('Enter new username: ', (username) => {
            rl.question('Enter new password: ', (password) => {
                saveCredentials(username, password);
                rl.close();
            });
        });
    } else {
        console.log("Invalid option. Please choose 'l' for login or 'c' for create user.");
        rl.close();
    }
});
