type HashFunction<K> = (key: K) => number;

type ProbingFunction<K> = (length: number, key: K, i: number) => number;

type ProbingHashtable<K, V> = {
    readonly keys: Array<K | null | undefined>,
    readonly data: Array<V>,
    probe: ProbingFunction<K>,
    size: number // number of elements
};

function ph_empty<K, V>(length: number,
    probe: ProbingFunction<K>): ProbingHashtable<K, V> {
    return { keys: new Array(length), data: new Array(length), probe, size: 0 };
}

function probe_from<K, V>({ keys, probe }: ProbingHashtable<K, V>,
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

function ph_insert<K, V>(tab: ProbingHashtable<K, V>, key: K, value: V): boolean {
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

function ph_lookup<K, V>(tab: ProbingHashtable<K, V>, key: K): V | undefined {
    const index = probe_from(tab, key, 0);
    return index === undefined
        ? undefined
        : tab.data[index];
}

function probe_linear<K>(hash: HashFunction<K>): ProbingFunction<K> {
    return (length: number, key: K, i: number) => (hash(key) + i) % length;
}

const calendar = {
    January: [],
    February: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: []
}
type Activity = {
    Month: string, // the identifier as described above
    Date: string
    Start: string,
    End: string,
    Activity: string
};
type ActivityTable = ProbingHashtable<number, Activity>;

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

function makeData(month: string, date: string, start: string, end: string, activity: string): void {
    const hashfunc: HashFunction<number> = key => key; //* string_to_number(activity) - string_to_number(month);
    let data: ActivityTable = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) : ph_empty(10, probe_linear(hashfunc));
    data.probe = probe_linear(hashfunc);
    const aktivitet: Activity = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    };
    const id: number = (string_to_number(activity) + string_to_number(month)) - parseInt(date);
    showMessage(JSON.stringify(id));
    ph_insert(data, id, aktivitet);
    localStorage.setItem('data', JSON.stringify({
        keys: data.keys,
        data: data.data,
        size: data.size
    }));
}

function makeData2(month: string, date: string, start: string, end: string, activity: string): void {
    const hashfunc: HashFunction<number> = key => key % 10;
    const probingFunction = probe_linear(hashfunc); // Skapa en probing funktion
    let data: ActivityTable = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) : {
        keys: new Array(20),
        data: new Array(20),
        probe: probingFunction, // Tilldela probing funktionen till 'probe'
        size: 0
    };

    const aktivitet: Activity = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    };
    const id: number = (string_to_number(activity) % string_to_number(date)) - parseInt(month);

    ph_insert(data, id, aktivitet);
    localStorage.setItem('data', JSON.stringify({
        keys: data.keys,
        data: data.data,
        size: data.size
    }));
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
    const start: HTMLInputElement | null = document.getElementById("Start_r") as HTMLInputElement;
    const end: HTMLInputElement | null = document.getElementById("End_r") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity_r") as HTMLInputElement;

    if (month && date && start && end && activity) {
        const month_value: string = month.value;
        const date_value: string = date.value;
        //const start_value: string = start.value;
        //const end_value: string = end.value; 
        const activity_value: string = activity.value;
        const id: number = (string_to_number(activity_value) % string_to_number(date_value)) - parseInt(month_value);
        const data: ActivityTable = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) : "There is no data hahahaha";
        if (ph_lookup(data, id)) {
            showMessage("du ska bli borttAGEN HALSGUGGEN :)))))")
        }
    }
}

function searchActivity(month: string, date: string): Activity[] {
    const hashfunc: HashFunction<number> = key => key; //* string_to_number(activity) - string_to_number(month);
    let data: ActivityTable = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) : ph_empty(10, probe_linear(hashfunc));
    data.probe = hashfunc;
    const activities: Activity[] = [];
    console.log(data);
     // Add this line to check the retrieved data

    for (let i = 0; i < data.keys.length; i++) {
        const key = data.keys[i];
        console.log("key", key);
        if (key !== null && key !== undefined) {
            const storedActivity = ph_lookup(data, key);
            console.log(key, storedActivity);
            
            if (storedActivity && storedActivity.Month === month && storedActivity.Date === date) {
                activities.push(storedActivity);
            }
        }
    }
    
    return activities; // Return array of activities for the specified date
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
    const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;
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

document.addEventListener("DOMContentLoaded", function() {
    const actionElement: HTMLSelectElement | null = document.getElementById("action") as HTMLSelectElement;
    if (actionElement) {
        actionElement.addEventListener("change", handleActionChange);
    }
});
