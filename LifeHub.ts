    //import * as HT from '../lib/hashtables';

    //import { Pair, List, head, tail, pair, is_null, list, length } from '../lib/list';
    let Global_username: string = "oooooo"

    type HashFunction<K> = (key: K) => number;

    type ProbingFunction<K> = (length: number, key: K, i: number) => number;

    type ProbingHashtable<K, V> = {
        readonly keys:  Array<K | null | undefined >,
        readonly data:  Array<V>,
        probe: ProbingFunction<K>,
        size: number // number of elements
    };

    function ph_empty<K, V>(length: number, probe: ProbingFunction<K>): ProbingHashtable<K,V> {
    return { keys: new Array(length), 
             data: new Array(length), 
             probe, 
             size: 0 };
    }

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

function ph_insert<K, V>(tab: ProbingHashtable<K,V>, key: K, value: V): boolean {
    function insertAt(index: number): true {
        tab.keys[index] = key;
        tab.data[index] = value;
        tab.size = tab.size + 1;
        return true;
    }
    function insertFrom(i: number): boolean {
        const index = tab.probe(tab.keys.length, key, i);
        showMessage(JSON.stringify(tab.keys.length));
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

    function ph_lookup<K, V>(tab: ProbingHashtable<K,V>, key: K): V | undefined {
        const index = probe_from(tab, key, 0);
        return index === undefined
               ? undefined
               : tab.data[index];
    }

    function probe_linear<K>(hash: HashFunction<K>): ProbingFunction<K> {
        return (length: number, key: K, i: number) => (hash(key) + i) % length;
    }

/*
    let date: Date = new Date(); // creates a new date object with the current date and time
let year: number = date.getFullYear(); // gets the current year
let month: number = date.getMonth(); // gets the current month (index based, 0-11)

const day: HTMLElement | null = document.querySelector(".calendar-dates"); // selects the element with class "calendar-dates"
const currdate: HTMLElement | null = document.querySelector(".calendar-current-date"); // selects the element with class "calendar-current-date"
const prenexIcons: NodeListOf<HTMLElement> = document.querySelectorAll(".calendar-navigation span"); // selects all elements with class "calendar-navigation span"

const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]; // array of month names

// function to generate the calendar
const manipulate = (): void => {
    // get the first day of the month
    let dayone: number = new Date(year, month, 1).getDay();

    // get the last date of the month
    let lastdate: number = new Date(year, month + 1, 0).getDate();

    // get the day of the last date of the month
    let dayend: number = new Date(year, month, lastdate).getDay();

    // get the last date of the previous month
    let monthlastdate: number = new Date(year, month, 0).getDate();

    let lit: string = ""; // variable to store the generated calendar HTML

    // loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
        lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
    }

    // loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {
        // check if the current date is today
        let isToday: string = i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? "active" : "";
        lit += `<li class="${isToday}">${i}</li>`;
    }

    // loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
        lit += `<li class="inactive">${i - dayend + 1}</li>`;
    }

    // update the text of the current date element with the formatted current month and year
    if (currdate) currdate.innerText = `${months[month]} ${year}`;

    // update the HTML of the dates element with the generated calendar
    if (day) day.innerHTML = lit;
};

manipulate();

// Attach a click event listener to each icon
prenexIcons.forEach(icon => {

    // When an icon is clicked
    icon.addEventListener("click", () => {
        // Check if the icon is "calendar-prev" or "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Check if the month is out of range
        if (month < 0 || month > 11) {
            // Set the date to the first day of the month with the new year
            date = new Date(year, month, new Date().getDate());
            // Set the year to the new year
            year = date.getFullYear();
            // Set the month to the new month
            month = date.getMonth();
        } else {
            // Set the date to the current date
            date = new Date();
        }

        // Call the manipulate function to update the calendar display
        manipulate();
    });
});

*/
    const kalender = {
        January: [],
        February: [],
        Mars: [],
        April: [], 
        May: [],
        June: [], 
        July: [], 
        August: [], 
        September: [], 
        October: [], 
        Novemeber: [], 
        December: []
    }
    type Activity = {
        Month: string, // the identifier as described above
        Date: string
        Start: string,
        End: string,
        Activity: string
    };
    type ActivityTable = ProbingHashtable<number,Activity>;

    function string_to_number(str: string) {
        let sum = 0;
        for (let i = 0; i < str.length; i = i + 1) {
        sum = sum + str.charCodeAt(i);
        }
    return sum;
    }

    function showMessage(message: string): void {
        const messageElement: HTMLElement | null = document.getElementById("message");
        if (messageElement) {
            messageElement.innerText = message;
        } else {
            console.error("Error: Unable to find message element.");
        }
    }

    function authenticate(username: string, password: string): boolean { // Borde göras om.......
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
    
    /*
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
    */
    
    function login(): void {
        const usernameElement: HTMLInputElement | null = document.getElementById("loginUsername") as HTMLInputElement;
        const passwordElement: HTMLInputElement | null = document.getElementById("loginPassword") as HTMLInputElement;

    
        if (usernameElement && passwordElement) {
            const username: string = usernameElement.value;
            const password: string = passwordElement.value;
            console.log("innan login", Global_username)
            // Call the authenticate function
            if (authenticate(username, password)) {
                Global_username = username;
                console.log("etfer login", Global_username)
                showMessage2("Welcome, " + username + "!");
                console.log("hej");
                const kalender: HTMLInputElement | null = document.getElementById("kalender") as HTMLInputElement;
                const login: HTMLInputElement | null = document.getElementById("login") as HTMLInputElement;
                const logout: HTMLInputElement | null = document.getElementById("logout") as HTMLInputElement;
                console.log(kalender, login);
                kalender.style.display = "block";
                
                login.style.display = "none";
                logout.style.display = "flex";
                
            } else {
                showMessage2("Authentication failed. Please try again.");
            }
        } else {
            console.error("Error: Unable to find username or password input elements.");
        }
    }

    function logout(): void {
        console.log("logout", Global_username);
        const kalender: HTMLInputElement | null = document.getElementById("kalender") as HTMLInputElement;
        const login: HTMLInputElement | null = document.getElementById("login") as HTMLInputElement;
        const logout: HTMLInputElement | null = document.getElementById("logout") as HTMLInputElement;
        kalender.style.display = "none";
        login.style.display = "block";
        logout.style.display = "none";
        showMessage(Global_username + " has been logged out");
        Global_username = "OOOOO";
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

    
    function handleActionKeyPress2(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            const actionElement: HTMLInputElement | null = document.getElementById("action") as HTMLInputElement;
            if (actionElement) {
            const action: string = actionElement.value;
            const loginFormElement: HTMLElement | null = document.getElementById("loginForm");
            const createFormElement: HTMLElement | null = document.getElementById("createForm");
            const messageElement: HTMLElement | null = document.getElementById("message");
            //(document.getElementById("kalender") as HTMLElement).style.display = "none"
                if (action === "l" && loginFormElement && createFormElement && kalender) {
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
    
    (document.getElementById("action") as HTMLInputElement).addEventListener("keypress", handleActionKeyPress2);

    function makeData(month: string, date: string, start: string, end: string, activity: string): void {
        const hashfunc: HashFunction<number> = key => key //* string_to_number(activity) - string_to_number(month);
        const data_con: string = localStorage.getItem(Global_username + '_data') as string;
        const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
        data.probe = probe_linear(hashfunc);
        const aktivitet: Activity = {
            Month: month,
            Date: date,
            Start: start,
            End: end, 
            Activity: activity
        };
        //const id: number = parseInt(date);
        const id: number = (string_to_number(activity) + string_to_number(month)) - parseInt(date);
        //const hash_id: number = hashfunc(id);
        showMessage(JSON.stringify(id));
        ph_insert(data, id, aktivitet);
        localStorage.setItem(Global_username + '_data', JSON.stringify(data));
    }
    
   
    function add(): void {
        const month: HTMLInputElement | null = document.getElementById("Month_a") as HTMLInputElement;
        const date: HTMLInputElement | null = document.getElementById("Date_a") as HTMLInputElement;
        const start : HTMLInputElement | null = document.getElementById("Start_a") as HTMLInputElement;
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
        const start : HTMLInputElement | null = document.getElementById("Start_r") as HTMLInputElement;
        const end: HTMLInputElement | null = document.getElementById("End_r") as HTMLInputElement;
        const activity: HTMLInputElement | null = document.getElementById("Activity_r") as HTMLInputElement;

        if (month && date && start && end && activity) {
            const month_value: string = month.value;
            const date_value: string = date.value;
            //const start_value: string = start.value;
            //const end_value: string = end.value; 
            const activity_value: string = activity.value;
           
            const id: number = (string_to_number(activity_value) + string_to_number(month_value)) - parseInt(date_value);
            const hashfunc: HashFunction<number> = key => key 
            const data_con: string = localStorage.getItem(Global_username + '_data') as string;
            const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
            data.probe = probe_linear(hashfunc);
            console.log(JSON.stringify(data));
            console.log(JSON.stringify(id));
            console.log(JSON.stringify(ph_lookup(data, id)));
            if (ph_lookup(data, id)) {
                showMessage("Aktiviteten har blivit bortagen")
                ph_delete(data, id);
                localStorage.setItem(Global_username + '_data', JSON.stringify(data));
            }
        }

    }
    
    function searchActivity(month: string, date: string): Activity[] {
        const hashfunc: HashFunction<number> = key => key; //* string_to_number(activity) - string_to_number(month);
        let data: ActivityTable = localStorage.getItem(Global_username + '_data') ? JSON.parse(localStorage.getItem(Global_username + '_data') as string) : ph_empty(10, probe_linear(hashfunc));
        data.probe = probe_linear(hashfunc);
        const activities: Activity[] = [];
        console.log(data);
         // Add this line to check the retrieved data
    
        for (let i = 0; i < data.keys.length; i++) {
            const key = data.keys[i];
            console.log("key", key);
            if (key !== null && key !== undefined) {
                const storedActivity = ph_lookup(data, key);
                console.log(key, storedActivity, data);
                
                if (storedActivity && storedActivity.Month === month && storedActivity.Date === date) {
                    activities.push(storedActivity);
                }
            }
        }
        
        return activities;
    }
    
    
    function search(): void {
        const searchMonthInput: HTMLInputElement | null = document.getElementById("search_month") as HTMLInputElement;
        const searchDateInput: HTMLInputElement | null = document.getElementById("search_date") as HTMLInputElement;
        const messageElement: HTMLElement | null = document.getElementById("message");
    
        if (searchMonthInput && searchDateInput && messageElement) {
            const searchMonth: string = searchMonthInput.value;
            const searchDate: string = searchDateInput.value;
            const activities: Activity[] = searchActivity(searchMonth, searchDate);
    
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


    function handleActionChange(): void {
        const actionElement: HTMLSelectElement | null = document.getElementById("action2") as HTMLSelectElement;
        const addElement: HTMLElement | null = document.getElementById("add");
        const removeElement: HTMLElement | null = document.getElementById("remove");
        const searchElement: HTMLElement | null = document.getElementById("search");
        const messageElement: HTMLElement | null = document.getElementById("message");
    
        if (actionElement && addElement && removeElement && searchElement && messageElement) {
            const selectedAction: string = actionElement.value;
    
            // Reset message
            messageElement.innerText = "";
    
            if (selectedAction === "add") {
                addElement.style.display = "block";
                removeElement.style.display = "none";
                searchElement.style.display = "none";
            } else if (selectedAction === "remove") {
                addElement.style.display = "none";
                removeElement.style.display = "block";
                searchElement.style.display = "none";
            } else if (selectedAction === "search") {
                addElement.style.display = "none";
                removeElement.style.display = "none";
                searchElement.style.display = "block";
            } else {
                // Invalid option
                addElement.style.display = "none";
                removeElement.style.display = "none";
                searchElement.style.display = "none";
                messageElement.innerText = "Invalid option. Please choose 'add', 'remove', or 'search'.";
            }
        }
    }

    function handleActionChange2(): void {
        const actionElement: HTMLSelectElement | null = document.getElementById("action2") as HTMLSelectElement;
        const addElement: HTMLElement | null = document.getElementById("add");
        const removeElement: HTMLElement | null = document.getElementById("remove");
        const searchElement: HTMLElement | null = document.getElementById("search");
        const messageElement: HTMLElement | null = document.getElementById("message");
    
        if (actionElement && addElement && removeElement && searchElement && messageElement) {
            const selectedAction: string = actionElement.value;
    
            // Återställ add-menyns display-egenskap
            addElement.style.display = "none";
    
            // Reset message
            messageElement.innerText = "";
    
            if (selectedAction === "add") {
                addElement.style.display = "block";
                removeElement.style.display = "none";
                searchElement.style.display = "none";
            } else if (selectedAction === "remove") {
                removeElement.style.display = "block";
                searchElement.style.display = "none";
            } else if (selectedAction === "search") {
                searchElement.style.display = "block";
            } else {
                // Invalid option
                removeElement.style.display = "none";
                searchElement.style.display = "none";
                messageElement.innerText = "Invalid option. Please choose 'add', 'remove', or 'search'.";
            }
        }
    }
    
    
    document.addEventListener("DOMContentLoaded", function() {
        const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;
        if (actionElement) {
            actionElement.addEventListener("change", handleActionChange);
        }
    });
 
