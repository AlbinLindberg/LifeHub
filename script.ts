function authenticate(username: string, password: string): boolean {
    let credentials: { [key: string]: string } | null = null;
    try {
        credentials = JSON.parse(localStorage.getItem('credentials') as string ) || {};
    } catch (err) {
        return false;
    }

    if (credentials && credentials.hasOwnProperty(username) && credentials[username] === password) {
        return true;
    } else {
        return false;
    }
}

function authenticate3(username: string, password: string): boolean {
    let credentials: { [key: string]: string } | null = null;
    try {
        const storedCredentials = localStorage.getItem('credentials');
        if (storedCredentials) {
            credentials = JSON.parse(storedCredentials);
        } else {
            console.error("Credentials not found in local storage.");
            return false;
        }
    } catch (err) {
        console.error("Error parsing credentials:", err);
        return false;
    }

    if (credentials && credentials.hasOwnProperty(username) && credentials[username] === password) {
        return true;
    } else {
        return false;
    }
}

function login(): void {
    const usernameElement: HTMLInputElement | null = document.getElementById("loginUsername") as HTMLInputElement;
    const passwordElement: HTMLInputElement | null = document.getElementById("loginPassword") as HTMLInputElement;

    if (usernameElement && passwordElement) {
        const username: string = usernameElement.value;
        const password: string = passwordElement.value;

        // Call the authenticate function
        if (authenticate3(username, password)) {
            showMessage2("Welcome, " + username + "!");
        } else {
            showMessage2("Authentication failed. Please try again.");
        }
    } else {
        console.error("Error: Unable to find username or password input elements.");
    }
}

function showMessage2(message: string): void {
    const messageElement: HTMLElement | null = document.getElementById("message");
    if (messageElement) {
        messageElement.innerText = message;
    } else {
        console.error("Error: Unable to find message element.");
    }
}

function saveCredentials(username: string, password: string): void {
    const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
    credentials[username] = password;
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

function createUser(): void {
    const username: HTMLInputElement | null = document.getElementById("createUsername") as HTMLInputElement;
    const password: HTMLInputElement | null = document.getElementById("createPassword") as HTMLInputElement;
    
 
    if (username && password) {
        const user_name: string = username.value;
        const pass_word: string = password.value;
        saveCredentials(user_name, pass_word);
        const mess: HTMLElement | null = document.getElementById("message");
        if (mess) {
            mess.innerText = "User " + user_name + " created successfully.";
        } else {}
    }
};

/*
(document.getElementById("action") as HTMLInputElement).addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const action: string = (document.getElementById("action") as HTMLInputElement).value;
        const login_form: HTMLElement | null = document.getElementById("loginForm");
        const create_form: HTMLElement | null = document.getElementById("createForm");
        const messageElement: HTMLElement | null = document.getElementById("message");

        if (login_form && create_form && messageElement) {
            if (action === "l") {
                login_form.style.display = "block";
                create_form.style.display = "none";
            } else if (action === "c") {
                login_form.style.display = "none";
                create_form.style.display = "block";
            } else {
                messageElement.innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
            }
        }
    }
});
*/

function handleActionKeyPress2(event: KeyboardEvent): void {
    if (event.key === "Enter") {
        const actionElement: HTMLInputElement | null = document.getElementById("action") as HTMLInputElement;
        if (actionElement) {
        const action: string = actionElement.value;
        const loginFormElement: HTMLElement | null = document.getElementById("loginForm");
        const createFormElement: HTMLElement | null = document.getElementById("createForm");
        const messageElement: HTMLElement | null = document.getElementById("message");
            if (action === "l" && loginFormElement && createFormElement) {
                loginFormElement.style.display = "block";
                createFormElement.style.display = "none";
            } else if (action === "c" && loginFormElement && createFormElement) {
                loginFormElement.style.display = "none";
                createFormElement.style.display = "block";
            } else if (messageElement) {
                messageElement.innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
            }
        }
    }
}

(document.getElementById("action") as HTMLInputElement).addEventListener("keypress", handleActionKeyPress);
