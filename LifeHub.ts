 // functions from the course library  (from here)
/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param length the maximum number of elements to accomodate
 * @param hash the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
function ph_empty<K, V>(length: number, 
    probe: ProbingFunction<K>): ProbingHashtable<K,V> {
    return {keys: new Array(length), 
            data: new Array(length), 
            probe, 
            size: 0 };
}

// helper function implementing probing from a given probe index i
function probe_from<K, V>({keys, probe}: ProbingHashtable<K,V>, 
key: K, i: number): number | undefined {
    function step(i: number): number | undefined {
        const index = probe(keys.length, key, i);
        return i === keys.length || keys[index] === undefined
        ? undefined
        : keys[index] === key
        ? index
        : step(i + 1);
    }
    return step(i);
}


/**
* Search a hash table for the given key.
* @template K the type of keys
* @template V the type of values
* @param table the hash table to scan
* @param key the key to scan for
* @returns the associated value, or undefined if it does not exist.
*/
function ph_lookup<K, V>(tab: ProbingHashtable<K,V>, key: K): V | undefined {
    const index = probe_from(tab, key, 0);
    return index === undefined
    ? undefined
    : tab.data[index];
}


/**
* Insert a key-value pair into a probing hash table.
* Overwrites the existing value associated with the key, if any.
* @template K the type of keys
* @template V the type of values
* @param table the hash table
* @param key the key to insert at
* @param value the value to insert
* @returns true iff the insertion succeeded (the hash table was not full)
*/
function ph_insert<K, V>(tab: ProbingHashtable<K,V>, key: K, value: V): boolean {
    function insertAt(index: number): true {
        tab.keys[index] = key;
        tab.data[index] = value;
        tab.size = tab.size + 1;
        return true;
        }
    function insertFrom(i: number): boolean {
        const index = tab.probe(tab.keys.length, key, i);
        if (tab.keys[index] === key || tab.keys[index] === undefined) {
            return insertAt(index);
        } else if (tab.keys[index] === null) {
            const location = probe_from(tab, key, i);
            return insertAt(location === undefined ? index : location);
        } else {
            return insertFrom(i + 1);
        }
    }
    return tab.keys.length === tab.size ? false : insertFrom(0);
}


/**
* Delete a key-value pair from a probing hash table.
* @template K the type of keys
* @template V the type of values
* @param table the hash table
* @param key the key to delete
* @returns true iff the key existed
*/
function ph_delete<K, V>(tab: ProbingHashtable<K,V>, key: K): boolean {
    const index = probe_from(tab, key, 0);
    if (index === undefined) {
        return false;
    } else { 
        tab.keys[index] = null;
        tab.size = tab.size - 1;
        return true;
    }
}

// linear probing with a given hash function
function probe_linear<K>(hash: HashFunction<K>): ProbingFunction<K> {
    return (length: number, key: K, i: number) => (hash(key) + i) % length;
}
 // functions from the course library  (to here)

//import * as HT from '../lib/hashtables';

//import { Pair, List, head, tail, pair, is_null, list, length } from '../lib/list';
let Global_username: string | null= null; // This is set to the username that is currently logged in

type HashFunction<K> = (key: K) => number; // The type for a hash function

type ProbingFunction<K> = (length: number, key: K, i: number) => number; // The type for a probing function

type ProbingHashtable<K, V> = {                     // The type for a probing hashtable
    readonly keys: Array<K | null | undefined>,     // readonly has been removed from probe  
    readonly data: Array<V>,                        // because when the probing hashtable is 
    probe: ProbingFunction<K>,                      // saved down with JSON stringify it 
    size: number                                    // becomes undefined so it has to set 
};                                                  // every time it opens

type Activity = {               // The type for an acticity
    Month: string,
    Date: string
    Start: string,
    End: string,
    Activity: string
};

type ActivityTable = ProbingHashtable<string, Activity>     // Type for an activity table

const hashfunc: HashFunction<string> = key => string_to_number(key); // The function that turns the key
                                                                    // from a string to number

const prob_hash: ProbingFunction<string> = probe_linear(hashfunc); // The probing function of hashfunc

const Act_table_size: number = 1000; // constant declaring the size the users calender 

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/**
* Turns a string into a number
* @example
* // string_to_number("Hello") returns 500
* @param str A string containing of letters, numbers or other special characters
* @precondition str must be a string.
* @returns a number based on the added sum of each 
* letters Unicode value in str
*/
function string_to_number(str: string): number {
    let sum = 0; 
    for (let i = 0; i < str.length; i = i + 1) {
        sum = sum + str.charCodeAt(i);
    }
    return sum;
}

/**
 * Displays a message in the browser.
 * Updates the content of 
 * the message element with the provided message.
 * @example
 * // Displays the message "Hello, world!" in the browser
 * showMessage("Hello, world!");
 * @param message A string containing the message to display.
 * @returns Nothing.
 */
function showMessage(message: string): void {
    const messageElement: HTMLElement | null = document.getElementById("message");
    if (messageElement) {
        messageElement.innerText = message;
    } else {}
}


/**
 * Hides the HTML element with the specified ID.
 * Sets the display style property of the element to "none".
 * @example
 * // Hides the element with ID "kalender"
 * hideElementById("kalender");
 * @param id The ID of the HTML element to hide.
 * @returns Nothing.
 */
function hideElementById(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = "none";
    }
}

/**
 * Displays the HTML element with the specified ID.
 * Sets the display style property of the element to "block".
 * @example
 * // Displays the element with ID "login"
 * showElementById("login");
 * @param id The ID of the HTML element to display.
 * @returns Nothing.
 */
function showElementById(id: string): void {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = "block";
    }
}

/**
 * Sets the value of the HTML input element with the specified ID.
 * Updates the value property of the input element with the provided value.
 * @example
 * // Sets the value of the input element with ID "Date_a" to "1"
 * setValueById("Date_a", "1");
 * @param id The ID of the HTML input element.
 * @param value The value to set for the input element.
 * @returns Nothing.
 */
function setValueById(id: string, value: string): void {
    const element = document.getElementById(id) as HTMLInputElement;
    if (element) {
        element.value = value;
    }
}

/**
 * Creates a new user with the provided username and password.
 * If the username is available, the user is created successfully.
 * If the username is already taken, an error message is displayed.
 * Updates the message element with the appropriate message
 * and saves the username and password if the username is not already taken
 * @example
 * // Assuming input fields with ids "createUsername" and "createPassword"
 * // and a message element with id "message"
 * createUser();
 * @precondition The input fields with ids "createUsername" and "createPassword" must exist in the DOM.
 * @returns Nothing.
 */
function createUser(): void {
    const username: HTMLInputElement | null = document.getElementById("createUsername") as HTMLInputElement;
    const password: HTMLInputElement | null = document.getElementById("createPassword") as HTMLInputElement;
    const message: HTMLElement | null = document.getElementById("message")

    if (username && password && message) {
        if (username.value === "" || password.value === "") {
            showMessage("Both input boxes has to be filled in");
        }
        else if (existing_username(username.value) === false) {
            saveCredentials(username.value, password.value);
            showMessage("User "+ username.value + " created successfully.");
            setValueById("createUsername", "");
            setValueById("createPassword", "");
        } else {
            showMessage("Username has been taken, please chose a different username.");
            setValueById("createUsername", "");
            setValueById("createPassword", "");;
        }
    } else { }
}

/**
 * Saves down a username and password pair in the local storage.
 * @example
 * // returns {Bob: "123"} in local storage
 * saveCredentials("Bob", "123")
 * @param username A string representing the username
 * @param password A string representing the password
 * @precondition username and password are strings.
 * @returns An updated version of credentials with the username
 * and password pair in it
 */
function saveCredentials(username: string, password: string): void {
    const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
    credentials[username] = password;
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

/**
 * Checks if a username is already taken.
 * @example
 * // returns true
 * createUser("Bob", "123");
 * existing_username("Bob");
 * @param username A string representing the username
 * @precondition username is a string.
 * @returns True if the username exists and false if it does not exists in credentials
 */
function existing_username(username: string): boolean {
    const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
    if (credentials[username]) {
        return true;
    } else {
        return false;
    }
}    

/**
 * The function responsible for the login process.
 * Makes the login menu visible and 
 * sets Global_username to username.
 * @example
 * // When the login button is pressed in the 
 * // selection tab the login menu appears
 * login()
 * @returns Nothing.
 */
function login(): void {
    const usernameElement: HTMLInputElement | null = document.getElementById("loginUsername") as HTMLInputElement;
    const passwordElement: HTMLInputElement | null = document.getElementById("loginPassword") as HTMLInputElement;


    if (usernameElement && passwordElement) {
        const username: string = usernameElement.value;
        const password: string = passwordElement.value;
        
        if (authenticate(username, password)) {
            Global_username = username;
            showMessage("Welcome, " + username + "!");
            showElementById("kalender");
            showElementById("logout");
            hideElementById("login");
            setValueById("loginUsername", "");
            setValueById("loginPassword", "");
        } else {
            showMessage("Authentication failed. Please try again.");
        }
    } else {}
}

/**
 * The function responsible for the logout process.
 * Makes the login menu visible, 
 * sets Global_username to null and resets the calender 
 * for the next login
 * @example
 * // When the logout button is pressed you 
 * are returned to the login/create user menu
 * logout()
 * @returns Nothing.
 */
function logout(): void {
    hideElementById("kalender");
    showElementById("login");
    hideElementById("logout");

    setValueById("action2", "add");

    showElementById("add");
    setValueById("Date_a", "1");
    setValueById("Month_a", "January");
    setValueById("Start_a", "");
    setValueById("End_a", "");
    setValueById("Activity_a", "");

    hideElementById("remove");
    setValueById("Month_r", "January");
    setValueById("Date_r", "1");
    setValueById("Activity_r", "");

    hideElementById("repeat");
    showElementById("repeat_button");

    hideElementById("search");
    setValueById("search_month", "January")
    setValueById("search_date", "1")

    hideElementById("search2");
    setValueById("search_month2", "January")

    hideElementById("search3");
    setValueById("search_activity", "")

    showMessage(Global_username + " has been logged out");
    Global_username = null;
}

/**
 * Checks if the user exist within credentials.
 * @example
 * // returns true
 * createUser("Bob", "123");
 * authenticate("Bob", "123");
 * @param username A string representing the username.
 * @param password A string representing the password.
 * @precondition username and password are strings
 * @returns True if the username and password combination 
 * exists in credentials.
 */
function authenticate(username: string, password: string): boolean {
    const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
    if (credentials && credentials.hasOwnProperty(username) && credentials[username] === password) {
        return true;
    } else {
        return false;
    }

}

/**
 * Function responsible for the selection menu for
 * login/Create user.
 * Makes the "login form" visible and 
 * "Create user form" unvisible or vice versa.
 * @example
 * // if the "Create user" button is pressed in the 
 * selection tab, the create user menu appears with no
 * text in the input boxes
 * login_create_selection()
 * @returns Nothing.
 */
function login_create_selection(): void {
    const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;

    if (actionElement) {
        const selectedAction: string = actionElement.value;

        showMessage("");

        if (selectedAction === "loginForm") {
            showElementById("loginForm")
            hideElementById("createForm")
            setValueById("loginUsername", "")
            setValueById("loginPassword", "")
        } else if (selectedAction === "createForm") {
            hideElementById("loginForm")
            showElementById("createForm")
            setValueById("createUsername", "")
            setValueById("createPassword", "")
        } else {}
    } else {}
}

/**
 * Function responsible for checking if the user 
 * changes between the login or create user form 
 * in the selection tab.
 * Listens if the user changes 
 * between "Login" and "Create user" is the selection tab
 * and calls the login_create_selection function when that happens.
 * @example
 * // if tone of the buttons is pressed in the 
 * selection tab, the function recognizes that 
 * @returns Nothing.
 */
document.addEventListener("DOMContentLoaded", function (): void {
    const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;
    if (actionElement) {
        actionElement.addEventListener("change", login_create_selection);
    } else {}
});

/**
 * Creates an activity and stores it in a hashtable.
 * Either opens an already exsiting hashtable
 * for the current user or creates an empty one and stores the 
 * activity in it.
 * @example
 * // will save down the activity in Bobs calender
 * createUser("Bob", "123");
 * login()
 * makeData("January", "12", "12:00", "13:00", "Walk")
 * @param month The month of the activity.
 * @param date The date of the activity.
 * @param start The start time of the activity.
 * @param end The end time of the activity.
 * @param activity The activity description.
 * @precondition all parameters has to be strings
 * @returns Nothing.
 */
function makeData(month: string, date: string, start: string, end: string, activity: string): void { 
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(Act_table_size, probe_linear(hashfunc));
    data.probe = prob_hash;

    const aktivitet: Activity = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    }

    //const id: number = Hash_Function(month, date, activity);
    const id: string = month + date + activity
    if (ph_lookup(data, id)) {
        showMessage("This activity has already been added.");
    } else {
        ph_insert(data, id, aktivitet);
        showMessage("The activity has been added.");
        localStorage.setItem(Global_username + '_data', JSON.stringify(data));
    }
}

/**
 * The function that is called when the "Add activity"
 * button is pressed.
 * Either shows a message when the user has
 * not filled in all boxes or calls the makeData function and clears
 * all input elements
 * @example
 * // takes out what was put in the different html elements, checks the 
 * properties of the elements and dependning on what the properties are
 * it will behave differently
 * add()
 * @returns Nothing. 
 */
function add(): void {
    const month: HTMLInputElement | null = document.getElementById("Month_a") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date_a") as HTMLInputElement;
    const start: HTMLInputElement | null = document.getElementById("Start_a") as HTMLInputElement;
    const end: HTMLInputElement | null = document.getElementById("End_a") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity_a") as HTMLInputElement;

    if (month.value === "" || date.value === "" || start.value === "" || end.value === "" || activity.value === "") {
        showMessage("Make sure all the boxes has been filled in")
    } else {
        makeData(month.value, date.value, start.value, end.value, activity.value);
        setValueById("Date_a", "");
        setValueById("Month_a", "");
        setValueById("Start_a", "");
        setValueById("End_a", "");
        setValueById("Activity_a", "");
    }
}

/**
 * Removes an activity.
 * Either opens an already exsiting hashtable
 * for the current user or creates an empty one and deletes the 
 * activity. If the activity does not exist a message appears.
 * @example
 * // will remove the activity from Bobs calender
 * createUser("Bob", "123");
 * login()
 * makeData("January", "12", "12:00", "13:00", "Walk")
 * removeData("January", "12", "Walk")
 * @param month The month of the activity.
 * @param date The date of the activity.
 * @param activity The activity description.
 * @precondition all parameters has to be strings
 * @returns Nothing.
 */
function removeData(month:string, date: string, activity: string): void {
    const id: string = month + date + activity
    //const id: number = Hash_Function(month, date, activity);
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(Act_table_size, probe_linear(hashfunc));
    data.probe = prob_hash;
    if (ph_lookup(data, id)) {
        showMessage("The activity has been deleted.")
        ph_delete(data, id);
        localStorage.setItem(Global_username + '_data', JSON.stringify(data));
    } else {
        showMessage("This activity does not exist.")
    }
}

/**
 * The function that is called when the "Remove activity"
 * button is pressed.
 * Either shows a message when the user has
 * not filled in all boxes or calls the removeData function and clears
 * all input elements
 * @example
 * // takes out what was put in the different html elements, checks the 
 * properties of the elements and dependning on what the properties are
 * it will behave differently
 * remove()
 * @returns Nothing.
 */
function remove(): void {
    const month: HTMLInputElement | null = document.getElementById("Month_r") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date_r") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity_r") as HTMLInputElement;

    if (month.value === "" || date.value === "" || activity.value === "") {
        showMessage("Make sure all the boxes has been filled in")
    } else {
        removeData(month.value, date.value, activity.value);
        setValueById("Date_r", "");
        setValueById("Month_r", "");
        setValueById("Activity_r", "");
    }
}

/**
 * The function that is called when the "Clear calender"
 * button is pressed.
 * Deletes the current users calender and 
 * displays a mesage that it has been done.
 * @example
 * // Deletes the currents user calender
 * clearCalender()
 * @returns Nothing.
 */
function clearCalendar(): void {
    if (localStorage.getItem(Global_username + '_data')) {
        localStorage.removeItem(Global_username + '_data');
        showMessage("Calendar cleared for " + Global_username + "." );
    } else {
        showMessage(Global_username + " has no calender.")
    }
}

/**
 * The function that is called when the "Search date"
 * button is pressed.
 * Displays all activites on a date.
 * @example
 * // will display: 
 * // "Activities found for January 12:
 * // Start: 12:00, End: 13:00, Activity: Walk
 * // Start: 08:00, End: 10:00, Activity: Gym
 * // Start: 15:00, End: 16:00, Activity: Fika"
 * createUser("Bob", "123");
 * login();
 * add();
 * makeData("January", "12", "08:00", "10:00", "Gym");
 * makeData("January", "12", "12:00", "13:00", "Walk");
 * makeData("January", "12", "15:00", "16:00", "Fika");
 * search_date()
 * search_date_helper("January", "12");
 * search_date()
 * @returns Nothing.
 */
function search_date(): void {
    const searchMonthInput: HTMLInputElement | null = document.getElementById("search_month") as HTMLInputElement;
    const searchDateInput: HTMLInputElement | null = document.getElementById("search_date") as HTMLInputElement;

    if (searchMonthInput && searchDateInput) {
        const searchMonth: string = searchMonthInput.value;
        const searchDate: string = searchDateInput.value;
        const activities: Activity[] = search_date_helper(searchMonth, searchDate);

        if (activities.length > 0) {
            let message = "Activities found for " + searchMonth + " " + searchDate + ":\n";
            activities.forEach(activity => {
                message += "Start: " + activity.Start + ", End: " + activity.End + ", Activity: " + activity.Activity + "\n";
            });
            showMessage(message);
        } else {
            showMessage("No activities found for " + searchMonth + " " + searchDate);
        }
    } else {}
}

/**
 * Helper function for search_date.
 * @example
 * // will return an array contaning the activities 
 * // on the same date
 * // made by:
 * // makeData("January", "12", "08:00", "10:00", "Gym");
 * // makeData("January", "12", "12:00", "13:00", "Walk");
 * // makeData("January", "12", "15:00", "16:00", "Fika");
 * createUser("Bob", "123");
 * login();
 * add();
 * makeData("January", "12", "08:00", "10:00", "Gym");
 * makeData("January", "12", "12:00", "13:00", "Walk");
 * makeData("January", "12", "15:00", "16:00", "Fika");
 * search_date()
 * search_date_helper("January", "12");
 * @param month The month of the activity.
 * @param date The date of the activity
 * @precondition month and date has to be string
 * @returns An array containing all activiteis on a specific date
 */
function search_date_helper(month: string, date: string): Activity[] {
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    let data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(Act_table_size, probe_linear(hashfunc));
    data.probe = prob_hash;
    const activities: Activity[] = [];

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            
            if (storedActivity && storedActivity.Month === month && storedActivity.Date === date) {
                activities.push(storedActivity);
            } else {}
        } else {}
    }
    
    return activities; 
}

/**
 * The function that is called when the "Search month"
 * button is pressed.
 * Displays all activites in a specific month.
 * @example
 * // will display: 
 * // "Activities found for January:
 * // Date: 14, Start: 12:00, End: 13:00, Activity: Walk
 * // Date: 1, Start: 08:00, End: 10:00, Activity: Gym
 * // Date: 19, Start: 15:00, End: 16:00, Activity: Fika"
 * createUser("Bob", "123");
 * login();
 * add();
 * makeData("January", "1", "08:00", "10:00", "Gym");
 * makeData("January", "14", "12:00", "13:00", "Walk");
 * makeData("January", "19", "15:00", "16:00", "Fika");
 * search_month()
 * @returns Nothing.
 */
function search_month(): void {
    const searchMonthInput: HTMLInputElement | null = document.getElementById("search_month2") as HTMLInputElement;

    if (searchMonthInput) {
        const searchMonth: string = searchMonthInput.value;
        const activities: Activity[] = search_month_helper(searchMonth);

        if (activities.length > 0) {
            let message = "Activities found for " + searchMonth + " " + ":\n";
            activities.forEach(activity => {
                message += "Date: " + activity.Date + ", Start: " + activity.Start + ", End: " + activity.End + ", Activity: " + activity.Activity + "\n";
            });
            showMessage(message);
        } else {
            showMessage("No activities found for " + searchMonth + " ");
        }
    } else {}
}

/**
 * Helper function for search_month.
 * @example
 * // will return an array contaning the activities 
 * // in the same month
 * // Date: 14, Start: 12:00, End: 13:00, Activity: Walk
 * // Date: 1, Start: 08:00, End: 10:00, Activity: Gym
 * // Date: 19, Start: 15:00, End: 16:00, Activity: Fika"
 * createUser("Bob", "123");
 * login();
 * add();
 * makeData("January", "1", "08:00", "10:00", "Gym");
 * makeData("January", "14", "12:00", "13:00", "Walk");
 * makeData("January", "19", "15:00", "16:00", "Fika");
 * search_month();
 * search_month_helper("January");
 * @param month The month of the activity
 * @precondition month has to be a string
 * @returns An array containing all activiteis on a specific month
 */
function search_month_helper(month: string): Activity[] {
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    let data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(Act_table_size, probe_linear(hashfunc));
    data.probe = prob_hash;
    const activities: Activity[] = [];

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            
            if (storedActivity && storedActivity.Month === month) {
                activities.push(storedActivity);
            } else {}
        } else {}
    }
    
    return activities;
}

/**
 * The function that is called when the "Search activity"
 * button is pressed.
 * Displays all activites that has the same activity description.
 * @example
 * // will display: 
 * // "Activities found for Walk :
 * Start: 11:11, End: 11:01, Month: January, Date: 19
 * Start: 11:01, End: 11:11, Month: January, Date: 14
 * Start: 11:11, End: 11:11, Month: January, Date: 1"
 * createUser("Bob", "123");
 * login();
 * add();
 * makeData("January", "1", "08:00", "10:00", "Walk");
 * makeData("January", "14", "12:00", "13:00", "Walk");
 * makeData("January", "19", "15:00", "16:00", "Walk");
 * search_activity()
 * @returns Nothing.
 */
function search_activity(): void {
    const searchActivityInput: HTMLInputElement | null = document.getElementById("search_activity") as HTMLInputElement;

    if (searchActivityInput) {
        const searchActivity: string = searchActivityInput.value;
        const activities: Activity[] = search_activity_helper(searchActivity);

        if (activities.length > 0) {
            let message = "Activities found for " + searchActivity + " " + ":\n";
            activities.forEach(activity => {
                message += "Start: " + activity.Start + ", End: " + activity.End + ", Month: " + activity.Month + ", Date: " + activity.Date + "\n";
            });
            showMessage(message);
            setValueById("search_activity", "")
        } else {
            showMessage("No activities found for " + searchActivity + " ");
            setValueById("search_activity", "")
        }
    } else {}
}

/**
 * Helper function for search_month.
 * @example
 * // will display: 
 * "Activities found for Walk :
 * Start: 11:00, End: 12:00, Month: January, Date: 19
 * Start: 11:00, End: 12:00, Month: January, Date: 14
 * Start: 11:00, End: 12:00, Month: January, Date: 1";
 * createUser("Bob", "123");
 * login();
 * add();
 * makeData("January", "1", "11:00", "12:00", "Walk");
 * makeData("January", "14", "12:00", "12:00", "Walk");
 * makeData("January", "19", "11:00", "12:00", "Walk");
 * search_month();
 * search_month_helper("January");
 * @param activity The activity description of the activity
 * @precondition activity has to be a string
 * @returns An array containing all activiteis that has the same activity description
 */
function search_activity_helper(activity: string): Activity[] {
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    let data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(Act_table_size, probe_linear(hashfunc));
    data.probe = prob_hash;
    const activities: Activity[] = [];

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            
            if (storedActivity && storedActivity.Activity === activity) {
                activities.push(storedActivity);
            } else {}
        } else {}
    }
    
    return activities; 
}

/**
 * Function responsible for the selection menu for
 * all the different functions in the calender.
 * Makes the desired action menu visible 
 * and the other ones unvisible
 * @example
 * // if the "Search date" button is pressed in the 
 * selection tab, the search date menu appears
 * login_create_selection()
 * @returns Nothing.
 */
function calender_selection(): void {
    const actionElement: HTMLSelectElement | null = document.getElementById("action2") as HTMLSelectElement;

    if (actionElement) {
            const selectedAction: string = actionElement.value;

            showMessage("");

            if (selectedAction === "add") {
                showElementById("add")
                hideElementById("remove")
                hideElementById("search")
                hideElementById("search2")
                hideElementById("search3")
            } else if (selectedAction === "remove") {
                hideElementById("add")
                showElementById("remove")
                hideElementById("search")
                hideElementById("search2")
                hideElementById("search3")
            } else if (selectedAction === "search") {
                hideElementById("add")
                hideElementById("remove")
                showElementById("search")
                hideElementById("search2")
                hideElementById("search3")
            } else if (selectedAction === "search2") {
                hideElementById("add")
                hideElementById("remove")
                hideElementById("search")
                showElementById("search2")
                hideElementById("search3")
            } else if (selectedAction === "search3") {
                hideElementById("add")
                hideElementById("remove")
                hideElementById("search")
                hideElementById("search2")
                showElementById("search3")
            } else {}
    } else {}
}


/**
 * Function responsible for checking if the user 
 * changes between the calender actions 
 * in the selection tab.
 * Listens if the user changes 
 * between the different actions in the selection tab
 * and calls the calender_selection function when that happens
 * @example
 * // if one of the buttons is pressed in the 
 * selection tab, the function recognizes that 
 * @returns Nothing.
 */
document.addEventListener("DOMContentLoaded", function (): void {
    const actionElement: HTMLSelectElement | null = document.getElementById("action2") as HTMLSelectElement;
    if (actionElement) {
        actionElement.addEventListener("change", calender_selection);
    } else {}
});

/**
* Repeat an activity for multiple weeks.
* Will repeat an activity for as many 
* weeks as the parameter weeks and save each activity in
* the users calender.
* @example
* // will add the activity for 4 weeks forward in the calender
* createUser("Bob", "123");
* login();
* add();
* repeatActivity_helper();
* repeatActivity("January", "1", "11:00", "12:00", "Walk", 4);
* @param month The month of the activity.
* @param date The date of the activity.
* @param start The start time of the activity.
* @param end The end time of the activity.
* @param activity The activity description.
* @param weeks Number of weeks to repeat the activity.
* @precondition All parameters are strings
* @returns Nothing.
*/
function repeatActivity(month: string, date: string, start: string, end: string, activity: string, weeks: number): void {

    const startDate: Date = new Date(month + " " + date);
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(Act_table_size, probe_linear(hashfunc));
    data.probe = prob_hash;

        for (let i = 0; i < weeks; i++) {
            const newDate: Date = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000)); // Incrementing date by 7 days for each week

            const newMonth: string = monthNames[newDate.getMonth()];
            const newDay: string = newDate.getDate().toString();
            const newActivity: Activity = {
                Month: newMonth,
                Date: newDay,
                Start: start,
                End: end,
                Activity: activity
            };

            //const id: number = Hash_Function(newMonth, newDay, activity);
            const id: string = newMonth + newDay + activity;
            if (!ph_lookup(data, id)) {
                ph_insert(data, id, newActivity);
            } else {}
        }

    localStorage.setItem(Global_username + '_data', JSON.stringify(data));
    setValueById("repeat_num", "");
    hideElementById("repeat");
    showElementById("add_button");
    showElementById("repeat_button")
    showMessage("Added the activity for " + JSON.stringify(weeks) + " weeks forward")
} 


/**
 * The function that is called when the "Confirm"
 * button is pressed.
 * Calls the repeatActivity function
 * and clears all input fields
 * @example
 * // takes out what was put in the different html elements, checks the 
 * properties of the elements and calls the repeatActivity function
 * with those elements as arguments 
 * repeat_helper()
 * @returns Nothing.
 */
function repeat_helper(): void {
    const month: HTMLInputElement | null = document.getElementById("Month_a") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date_a") as HTMLInputElement;
    const start: HTMLInputElement | null = document.getElementById("Start_a") as HTMLInputElement;
    const end: HTMLInputElement | null = document.getElementById("End_a") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity_a") as HTMLInputElement;
    const repeat_numElement: HTMLInputElement | null = document.getElementById("repeat_num") as HTMLInputElement

    if (month && date && start && end && activity && repeat_numElement) {
        repeatActivity(month.value, date.value, start.value, end.value, activity.value, parseInt(repeat_numElement.value));
        setValueById("Date_a", "");
        setValueById("Month_a", "");
        setValueById("Start_a", "");
        setValueById("End_a", "");
        setValueById("Activity_a", "");
    } else {}
}

/**
 * The function that is called when the "Repeat activity"
 * button is pressed.
 * Changes the display styles of the
 * "repeat", "add_button" and "repeat_button" html elements.
 * @example
 * // Makes the "Confirm" button and "How many weeks to repeat?" box 
 * appear while making the "Repeat activity" and "Add activity"
 * buttons unvisible
 * repeat_button()
 * @returns Nothing.
 */
function repeat_button(): void {
    showElementById("repeat");
    hideElementById("add_button");
    hideElementById("repeat_button")
}

/**
 * Listens if the user changes 
 * between the different dates in the selection tab
 * for months and dates
 * Calculates how many dates the choosen month has
 * and displays it
 * @example
 * // if the user changes from January to August the 
 * dates in the selection tab for dates will change from 31 to 30
 * @returns Nothing.
 */
document.addEventListener("DOMContentLoaded", () => {
    const monthSelect: HTMLSelectElement | null = document.getElementById("Month_a") as HTMLSelectElement;
    const dateSelect: HTMLSelectElement | null = document.getElementById("Date_a") as HTMLSelectElement;
    const monthOptions: HTMLSelectElement | null = document.getElementById("Month_r") as HTMLSelectElement;
    const dateOptions: HTMLSelectElement | null = document.getElementById("Date_r") as HTMLSelectElement;
    const searchMonthOptions: HTMLSelectElement | null = document.getElementById("search_month") as HTMLSelectElement;
    const searchDateOptions: HTMLSelectElement | null = document.getElementById("search_date") as HTMLSelectElement;

    if (monthSelect && dateSelect && monthOptions && dateOptions && searchMonthOptions && searchDateOptions) {
        monthSelect.addEventListener("change", () => {
            populateDays(monthSelect.value, dateSelect);
        });

        monthOptions.addEventListener("change", () => {
            populateDays(monthOptions.value, dateOptions);
        });

        searchMonthOptions.addEventListener("change", () => {
            populateDays(searchMonthOptions.value, searchDateOptions);
        });

        // Populate days function
        function populateDays(month: string, dropdown: HTMLSelectElement): void {
            dropdown.innerHTML = "";
            const daysInMonth: number = new Date(new Date().getFullYear(), getMonthIndex(month), 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                const option: HTMLOptionElement = document.createElement("option");
                option.text = i.toString();
                option.value = i.toString();
                dropdown.add(option);
            }
        }

        // Helper function to get month index
        function getMonthIndex(month: string): number {
            const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return months.indexOf(month) + 1;
        }

        // Initialize days for initial month selection
        populateDays(monthSelect.value, dateSelect);
        populateDays(monthOptions.value, dateOptions);
        populateDays(searchMonthOptions.value, searchDateOptions);
    }
});
