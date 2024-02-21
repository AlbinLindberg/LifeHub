import { ProbingHashtable, ph_empty, ph_insert, 
    ph_lookup, probe_linear, HashFunction } from '../lib/hashtables';

import { Pair, List, head, tail, pair, is_null, list, length } from '../lib/list';

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

function makeData(month: string, date: string, start: string, end: string, activity: string): void {
    const hashfunc: HashFunction<number> = key => key;
    const data: ActivityTable = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) :  ph_empty(10, probe_linear(hashfunc));
    const aktivitet: Activity = {
        Month: month,
        Date: date,
        Start: start,
        End: end, 
        Activity: activity
    };
    const id: number = (string_to_number(activity) % string_to_number(date)) - parseInt(month);

    ph_insert(data, id, aktivitet )
    localStorage.setItem('data', JSON.stringify(data));
}

function add(): void {
    const month: HTMLInputElement | null = document.getElementById("Month") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date") as HTMLInputElement;
    const start : HTMLInputElement | null = document.getElementById("Start") as HTMLInputElement;
    const end: HTMLInputElement | null = document.getElementById("End") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity") as HTMLInputElement;
    
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
    const month: HTMLInputElement | null = document.getElementById("Month") as HTMLInputElement;
    const date: HTMLInputElement | null = document.getElementById("Date") as HTMLInputElement;
    const start : HTMLInputElement | null = document.getElementById("Start") as HTMLInputElement;
    const end: HTMLInputElement | null = document.getElementById("End") as HTMLInputElement;
    const activity: HTMLInputElement | null = document.getElementById("Activity") as HTMLInputElement;

    if (month && date && start && end && activity) {
        const month_value: string = month.value;
        const date_value: string = date.value;
        //const start_value: string = start.value;
        //const end_value: string = end.value; 
        const activity_value: string = activity.value;
        const id: number = (string_to_number(activity_value) % string_to_number(date_value)) - parseInt(month_value);
        const data: ActivityTable = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data') as string) :  "There is no data hahahaha";
        if (ph_lookup(data, id)) {
            showMessage("du ska bli borttAGEN HALSGUGGEN :)))))")
        }
    }

}

/*
(document.getElementById("action") as HTMLInputElement).addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const action: string = (document.getElementById("action") as HTMLInputElement).value;
        const login_form: HTMLElement | null = document.getElementById("add");
        const create_form: HTMLElement | null = document.getElementById("remove");
        const messageElement: HTMLElement | null = document.getElementById("message");

        if (login_form && create_form && messageElement) {
            if (action === "add") {
                login_form.style.display = "block";
                create_form.style.display = "none";
            } else if (action === "remove") {
                login_form.style.display = "none";
                create_form.style.display = "block";
            } else {
                messageElement.innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
            }
        }
    }
});
*/

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
