//import * as HT from '../lib/hashtables';

//import { Pair, List, head, tail, pair, is_null, list, length } from '../lib/list';
let Global_username: string = "oooooo" // This is set to the username that is currently logged in

export type HashFunction<K> = (key: K) => number; // The type for a hash function

export type ProbingFunction<K> = (length: number, key: K, i: number) => number; // The type for a probing function

export type ProbingHashtable<K, V> = {                     // The type for a probing hashtable
    readonly keys: Array<K | null | undefined>,     // readonly has been removed from probe  
    readonly data: Array<V>,                        // because when the probing hashtable is 
    probe: ProbingFunction<K>,                      // saved down with JSON stringify it 
    size: number // number of elements              // becomes undefined so it has to set 
};                                                  // every time it opens

export type Activity = {               // The type for an acticity
    Month: string,
    Date: string
    Start: string,
    End: string,
    Activity: string
};

export type ActivityTable = ProbingHashtable<number, Activity>     // Type for an activity table

export const hashfunc: HashFunction<number> = key => key // 

/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param length the maximum number of elements to accomodate
 * @param hash the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
export function ph_empty<K, V>(length: number, 
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
export function ph_lookup<K, V>(tab: ProbingHashtable<K,V>, key: K): V | undefined {
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
export function ph_insert<K, V>(tab: ProbingHashtable<K,V>, key: K, value: V): boolean {
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
export function ph_delete<K, V>(tab: ProbingHashtable<K,V>, key: K): boolean {
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
export function probe_linear<K>(hash: HashFunction<K>): ProbingFunction<K> {
    return (length: number, key: K, i: number) => (hash(key) + i) % length;
}

export function string_to_number(str: string) {
    let sum = 0;
    for (let i = 0; i < str.length; i = i + 1) {
        sum = sum + str.charCodeAt(i);
    }
    return sum;
}

export function showMessage(message: string): void {
    const messageElement: HTMLElement | null = document.getElementById("message");
    if (messageElement) {
        messageElement.innerText = message;
    } else {
        console.error("Error: Unable to find message element.");
    }
}

export function Hash_Function(month: string, date: string, activity: string): number {
    return (string_to_number(activity) + string_to_number(month)) - parseInt(date);
}

export function authenticate(username: string, password: string): boolean {
    const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
    if (credentials && credentials.hasOwnProperty(username) && credentials[username] === password) {
        return true;
    } else {
        return false;
    }

}

export function login(): void {
    const usernameElement: HTMLInputElement | null = document.getElementById("loginUsername") as HTMLInputElement;
    const passwordElement: HTMLInputElement | null = document.getElementById("loginPassword") as HTMLInputElement;


    if (usernameElement && passwordElement) {
        const username: string = usernameElement.value;
        const password: string = passwordElement.value;
        
        if (authenticate(username, password)) {
            Global_username = username;
            showMessage("Welcome, " + username + "!");
            const kalender: HTMLInputElement | null = document.getElementById("kalender") as HTMLInputElement;
            const login: HTMLInputElement | null = document.getElementById("login") as HTMLInputElement;
            const logout: HTMLInputElement | null = document.getElementById("logout") as HTMLInputElement;
            kalender.style.display = "block";
            login.style.display = "none";
            logout.style.display = "block";
            usernameElement.value = "";
            passwordElement.value = "";

        } else {
            showMessage("Authentication failed. Please try again.");
        }
    } else {
        console.error("Error: Unable to find username or password input elements.");
    }
}

export function logout(): void {
    console.log("logout", Global_username);
    const kalender: HTMLInputElement | null = document.getElementById("kalender") as HTMLInputElement;
    const login: HTMLInputElement | null = document.getElementById("login") as HTMLInputElement;
    const logout: HTMLInputElement | null = document.getElementById("logout") as HTMLInputElement;
    kalender.style.display = "none";
    login.style.display = "block";
    logout.style.display = "none";
    showMessage(Global_username + " has been logged out");
    Global_username = "booo";
}

export function showMessage2(message: string): void {
    const messageElement: HTMLElement | null = document.getElementById("message");
    if (messageElement) {
        messageElement.innerText = message;
    } else {
        console.error("Error: Unable to find message element.");
    }
}

export function saveCredentials(username: string, password: string): void {
    const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
    credentials[username] = password;
    localStorage.setItem('credentials', JSON.stringify(credentials));
}

export function createUser(): void {
    const username: HTMLInputElement | null = document.getElementById("createUsername") as HTMLInputElement;
    const password: HTMLInputElement | null = document.getElementById("createPassword") as HTMLInputElement;
    const message: HTMLElement | null = document.getElementById("message")


    if (username && password && message) {
        saveCredentials(username.value, password.value);
        message.innerText = "User " + username.value + " created successfully.";
        username.value = "";
        password.value = "";
        } else { }
    }


export function login_create_selection(): void {
    const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;
    const loginElement: HTMLElement | null = document.getElementById("loginForm");
    const createElement: HTMLElement | null = document.getElementById("createForm");
    const messageElement: HTMLElement | null = document.getElementById("message");
    const login_usernameElement: HTMLInputElement | null = document.getElementById("loginUsername") as HTMLInputElement;
    const login_passwordElement: HTMLInputElement | null = document.getElementById("loginPassword") as HTMLInputElement;
    const create_usernameElement: HTMLInputElement | null = document.getElementById("createUsername") as HTMLInputElement;
    const create_passwordElement: HTMLInputElement | null = document.getElementById("createPassword") as HTMLInputElement;

    if (actionElement && loginElement && createElement && 
        messageElement && login_usernameElement && login_passwordElement
        && create_passwordElement && create_usernameElement) {

        const selectedAction: string = actionElement.value;
        console.log("hej" + selectedAction);

        // Reset message
        messageElement.innerText = "";

        if (selectedAction === "loginForm") {
            console.log(selectedAction)
            loginElement.style.display = "block";
            createElement.style.display = "none";
            login_usernameElement.value = "";
            login_passwordElement.value = "";
        } else if (selectedAction === "createForm") {
            console.log(selectedAction)
            loginElement.style.display = "none";
            createElement.style.display = "block";
            create_usernameElement.value = "";
            create_passwordElement.value = "";
        } else {
            // Invalid option
            loginElement.style.display = "none";
            createElement.style.display = "none";
            messageElement.innerText = "Invalid option. Please choose 'login' or 'create user'.";
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;
    if (actionElement) {
        actionElement.addEventListener("change", login_create_selection);
    }
});


        


//(document.getElementById("action") as HTMLInputElement).addEventListener("keypress", handleActionKeyPress2);

export function makeData(month: string, date: string, start: string, end: string, activity: string): void { 
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
    data.probe = probe_linear(hashfunc);

    const aktivitet: Activity = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    }

    const id: number = Hash_Function(month, date, activity);
    ph_insert(data, id, aktivitet);
    localStorage.setItem(Global_username + '_data', JSON.stringify(data));
}

export function clearCalendar() {
    localStorage.removeItem(Global_username + '_data');
    showMessage("Calendar cleared for " + Global_username + "." );
}

function add(): void {
    const month: HTMLInputElement | null = document.getElementById("Month_a") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date_a") as HTMLInputElement;
    const start: HTMLInputElement | null = document.getElementById("Start_a") as HTMLInputElement;
    const end: HTMLInputElement | null = document.getElementById("End_a") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity_a") as HTMLInputElement;

    if (month && date && start && end && activity) {
        const month_value: string = month.value;
        const date_value: string = date.value;
        const start_value: string = start.value;
        const end_value: string = end.value;
        const activity_value: string = activity.value;
        makeData(month_value, date_value, start_value, end_value, activity_value);
    }
}

function remove(): void {
    const month: HTMLInputElement | null = document.getElementById("Month_r") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date_r") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity_r") as HTMLInputElement;

    if (month && date && activity) {
        const month_value: string = month.value;
        const date_value: string = date.value; 
        const activity_value: string = activity.value;

        const id: number = Hash_Function(month_value, date_value, activity_value);
        const data_con: string = localStorage.getItem(Global_username + '_data') as string;
        const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
        data.probe = probe_linear(hashfunc);
        if (ph_lookup(data, id)) {
            showMessage("Aktiviteten har blivit bortagen")
            ph_delete(data, id);
            localStorage.setItem(Global_username + '_data', JSON.stringify(data));
        }
    }

}

export function search_date_helper(month: string, date: string): Activity[] {
    let data: ActivityTable = localStorage.getItem(Global_username + '_data') ? JSON.parse(localStorage.getItem(Global_username + '_data') as string) : ph_empty(10, probe_linear(hashfunc));
    data.probe = probe_linear(hashfunc);
    const activities: Activity[] = [];

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            console.log(key, storedActivity);
            
            if (storedActivity && storedActivity.Month === month && storedActivity.Date === date) {
                activities.push(storedActivity);
            }
        }
    }
    
    return activities; 
}

export function search_month_helper(month: string): Activity[] {
    let data: ActivityTable = localStorage.getItem(Global_username + '_data') ? JSON.parse(localStorage.getItem(Global_username + '_data') as string) : ph_empty(10, probe_linear(hashfunc));
    data.probe = probe_linear(hashfunc);
    const activities2: Activity[] = [];

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            console.log(key, storedActivity);
            
            if (storedActivity && storedActivity.Month === month) {
                activities2.push(storedActivity);
            }
        }
    }
    
    return activities2;
}

export function search_activity_helper(activity: string): Activity[] {

    let data: ActivityTable = localStorage.getItem(Global_username + '_data') ? JSON.parse(localStorage.getItem(Global_username + '_data') as string) : ph_empty(10, probe_linear(hashfunc));
    data.probe = probe_linear(hashfunc);
    const activities3: Activity[] = [];

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            console.log(key, storedActivity);
            
            if (storedActivity && storedActivity.Activity === activity) {
                activities3.push(storedActivity);
            }
        }
    }
    
    return activities3; 
}


export function search_date(): void {
    const searchMonthInput: HTMLInputElement | null = document.getElementById("search_month") as HTMLInputElement;
    const searchDateInput: HTMLInputElement | null = document.getElementById("search_date") as HTMLInputElement;
    const messageElement: HTMLElement | null = document.getElementById("message");

    if (searchMonthInput && searchDateInput && messageElement) {
        const searchMonth: string = searchMonthInput.value;
        const searchDate: string = searchDateInput.value;
        const activities: Activity[] = search_date_helper(searchMonth, searchDate);

        if (activities.length > 0) {
            let message = "Activities found for " + searchMonth + " " + searchDate + ":\n";
            activities.forEach(activity => {
                message += "Start: " + activity.Start + ", End: " + activity.End + ", Activity: " + activity.Activity + "\n";
            });
            messageElement.innerText = message;
        } else {
            messageElement.innerText = "No activities found for " + searchMonth + " " + searchDate;
        }
    }
}

export function search_month(): void {
    const searchMonthInput: HTMLInputElement | null = document.getElementById("search_month2") as HTMLInputElement;
    const messageElement: HTMLElement | null = document.getElementById("message");

    if (searchMonthInput && messageElement) {
        const searchMonth: string = searchMonthInput.value;
        const activities: Activity[] = search_month_helper(searchMonth);

        if (activities.length > 0) {
            let message = "Activities found for " + searchMonth + " " + ":\n";
            activities.forEach(activity => {
                message += "Date: " + activity.Date + ", Start: " + activity.Start + ", End: " + activity.End + ", Activity: " + activity.Activity + "\n";
            });
            messageElement.innerText = message;
        } else {
            messageElement.innerText = "No activities found for " + searchMonth + " " ;
        }
    }
}

export function search_activity(): void {
    const searchActivityInput: HTMLInputElement | null = document.getElementById("search_activity") as HTMLInputElement;
    const messageElement: HTMLElement | null = document.getElementById("message");

    if (searchActivityInput && messageElement) {
        const searchActivity: string = searchActivityInput.value;
        const activities: Activity[] = search_activity_helper(searchActivity);

        if (activities.length > 0) {
            let message = "Activities found for " + searchActivity + " " + ":\n";
            activities.forEach(activity => {
                message += "Start: " + activity.Start + ", End: " + activity.End + ", Month: " + activity.Month + ", Date: " + activity.Date + "\n";
            });
            messageElement.innerText = message;
        } else {
            messageElement.innerText = "No activities found for " + searchActivity + " " ;
        }
    }
}


export function calender_selection(): void {
    const actionElement: HTMLSelectElement | null = document.getElementById("action2") as HTMLSelectElement;
    const addElement: HTMLElement | null = document.getElementById("add");
    const removeElement: HTMLElement | null = document.getElementById("remove");
    const searchElement: HTMLElement | null = document.getElementById("search");
    const search2Element: HTMLElement | null = document.getElementById("search2");
    const search3Element: HTMLElement | null = document.getElementById("search3");
    const messageElement: HTMLElement | null = document.getElementById("message");

    if (actionElement && addElement && removeElement && searchElement && search2Element && search3Element && messageElement) {
        const selectedAction: string = actionElement.value;

        // Reset message
        messageElement.innerText = "";

        if (selectedAction === "add") {
            addElement.style.display = "block";
            removeElement.style.display = "none";
            searchElement.style.display = "none";
            search2Element.style.display = "none";
            search3Element.style.display = "none";
        } else if (selectedAction === "remove") {
            addElement.style.display = "none";
            removeElement.style.display = "block";
            searchElement.style.display = "none";
            search2Element.style.display = "none";
            search3Element.style.display = "none";
        } else if (selectedAction === "search") {
            addElement.style.display = "none";
            removeElement.style.display = "none";
            searchElement.style.display = "block";
            search2Element.style.display = "none";
            search3Element.style.display = "none";
        } else if (selectedAction === "search2") {
            addElement.style.display = "none";
            removeElement.style.display = "none";
            searchElement.style.display = "none";
            search2Element.style.display = "block";
            search3Element.style.display = "none";
        } else if (selectedAction === "search3") {
            addElement.style.display = "none";
            removeElement.style.display = "none";
            searchElement.style.display = "none";
            search2Element.style.display = "none";
            search3Element.style.display = "block";
        } else {
            // Invalid option
            addElement.style.display = "none";
            removeElement.style.display = "none";
            searchElement.style.display = "none";
            search3Element.style.display = "none";
            search2Element.style.display = "none";
            messageElement.innerText = "Invalid option. Please choose 'add', 'remove', or 'search'.";
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const actionElement: HTMLSelectElement | null = document.getElementById("action2") as HTMLSelectElement;
    if (actionElement) {
        actionElement.addEventListener("change", calender_selection);
    }
});