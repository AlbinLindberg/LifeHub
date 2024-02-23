type HashFunction<K> = (key: K) => number;

type ProbingFunction<K> = (length: number, key: K, i: number) => number;

type ProbingHashtable<K, V> = {
    readonly keys: Array<K | null | undefined>,
    readonly data: Array<V>,
    probe: ProbingFunction<K>,
    size: number // number of elements
};

type Activity = {
    Month: string,
    Date: string
    Start: string,
    End: string,
    Activity: string
};

type ActivityTable = ProbingHashtable<number, Activity>;

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

const data: ActivityTable = ph_empty(10, probe_linear(key => string_to_number(key.toString())));

function string_to_number(str: string): number {
    let sum = 0;
    for (let i = 0; i < str.length; i = i + 1) {
        sum = sum + str.charCodeAt(i);
    }
    return sum;
}

function addActivity(month: string, date: string, start: string, end: string, activity: string): void {
    const id: number = string_to_number(activity);
    const newActivity: Activity = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    };
    ph_insert(data, id, newActivity);
    localStorage.setItem('calendarData', JSON.stringify(data));
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
        addActivity(month_value, date_value, start_value, end_value, activity_value);
    }
}

// Function to initialize calendar data from localStorage
function initializeCalendarData(): void {
    const storedData = localStorage.getItem('calendarData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData) {
            Object.assign(data, parsedData);
        }
    }
}

// Call initializeCalendarData on application start to load data from localStorage
initializeCalendarData();

function handleActionKeyPress(event: KeyboardEvent): void {
    if (event.key === "Enter") {
        const actionElement: HTMLInputElement | null = document.getElementById("action") as HTMLInputElement;
        if (actionElement) {
            const action: string = actionElement.value;
            const addElement: HTMLElement | null = document.getElementById("add");
            const removeElement: HTMLElement | null = document.getElementById("remove");
            const messageElement: HTMLElement | null = document.getElementById("message");
            if (action === "add" && addElement && removeElement) {
                addElement.style.display = "block";
                removeElement.style.display = "none";
            } else if (action === "remove" && addElement && removeElement) {
                addElement.style.display = "none";
                removeElement.style.display = "block";
            } else if (messageElement) {
                messageElement.innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
            }
        }
    }
}

(document.getElementById("action") as HTMLInputElement).addEventListener("keypress", handleActionKeyPress);
