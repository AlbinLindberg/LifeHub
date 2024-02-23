//import {} from '../lib/hashtables';
function ph_empty(length, probe) {
    return { keys: new Array(length), data: new Array(length), probe: probe, size: 0 };
}
function probe_from(_a, key, i) {
    var keys = _a.keys, probe = _a.probe;
    function step(i) {
        var index = probe(keys.length, key, i);
        return i === keys.length || keys[index] === undefined
            ? undefined
            : keys[index] === key
                ? index
                : step(i + 1);
    }
    return step(i);
}
function ph_insert(tab, key, value) {
    function insertAt(index) {
        tab.keys[index] = key;
        tab.data[index] = value;
        tab.size = tab.size + 1;
        return true;
    }
    function insertFrom(i) {
        var index = tab.probe(tab.keys.length, key, i);
        if (tab.keys[index] === key || tab.keys[index] === undefined) {
            return insertAt(index);
        }
        else if (tab.keys[index] === null) {
            var location_1 = probe_from(tab, key, i);
            return insertAt(location_1 === undefined ? index : location_1);
        }
        else {
            return insertFrom(i + 1);
        }
    }
    return tab.keys.length === tab.size ? false : insertFrom(0);
}
function ph_lookup(tab, key) {
    var index = probe_from(tab, key, 0);
    return index === undefined
        ? undefined
        : tab.data[index];
}
function probe_linear(hash) {
    return function (length, key, i) { return (hash(key) + i) % length; };
}
var kalender = {
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
};
function string_to_number(str) {
    var sum = 0;
    for (var i = 0; i < str.length; i = i + 1) {
        sum = sum + str.charCodeAt(i);
    }
    return sum;
}
function showMessage(message) {
    var messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.innerText = message;
    }
    else {
        console.error("Error: Unable to find message element.");
    }
}
function makeData(month, date, start, end, activity) {
    var hashfunc = function (key) { return key; };
    var data_con = localStorage.getItem('data');
    var data = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
    data.probe = hashfunc;
    //showMessage(JSON.stringify(data));
    //showMessage(JSON.stringify(data.probe));
    var aktivitet = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    };
    var id = (string_to_number(activity) % string_to_number(month)) - parseInt(date);
    showMessage(JSON.stringify(id));
    ph_insert(data, id, aktivitet);
    localStorage.setItem('data', JSON.stringify(data));
}
function makeData2(month, date, start, end, activity) {
    var hashfunc = function (key) { return key % 10; };
    var probingFunction = probe_linear(hashfunc); // Skapa en probing funktion
    var data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {
        keys: new Array(20),
        data: new Array(20),
        //probe: probingFunction, // Tilldela probing funktionen till 'probe'
        size: 0
    };
    //showMessage(JSON.stringify(data.probe));
    var aktivitet = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    };
    var id = (string_to_number(activity) % string_to_number(date)) - parseInt(month);
    ph_insert(data, id, aktivitet);
    localStorage.setItem('data', JSON.stringify(data));
}
function add() {
    var month = document.getElementById("Month_a");
    var date = document.getElementById("Date_a");
    var start = document.getElementById("Start_a");
    var end = document.getElementById("End_a");
    var activity = document.getElementById("Activity_a");
    if (month && date && start && end && activity) {
        var month_value = month.value;
        var date_value = date.value;
        var start_value = start.value;
        var end_value = end.value;
        var activity_value = activity.value;
        makeData(month_value, date_value, start_value, end_value, activity_value);
    }
}
function remove() {
    var month = document.getElementById("Month_r");
    var date = document.getElementById("Date_r");
    var start = document.getElementById("Start_r");
    var end = document.getElementById("End_r");
    var activity = document.getElementById("Activity_r");
    if (month && date && start && end && activity) {
        var month_value = month.value;
        var date_value = date.value;
        //const start_value: string = start.value;
        //const end_value: string = end.value; 
        var activity_value = activity.value;
        var id = (string_to_number(activity_value) % string_to_number(date_value)) - parseInt(month_value);
        var data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : "There is no data hahahaha";
        if (ph_lookup(data, id)) {
            showMessage("du ska bli borttAGEN HALSGUGGEN :)))))");
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
function handleActionKeyPress(event) {
    if (event.key === "Enter") {
        var actionElement = document.getElementById("action");
        if (actionElement) {
            var action = actionElement.value;
            var addElement = document.getElementById("add");
            var removeElement = document.getElementById("remove");
            var messageElement = document.getElementById("message");
            if (action === "add" && addElement && removeElement) {
                addElement.style.display = "block";
                removeElement.style.display = "none";
            }
            else if (action === "remove" && addElement && removeElement) {
                addElement.style.display = "none";
                removeElement.style.display = "block";
            }
            else if (messageElement) {
                messageElement.innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
            }
        }
    }
}
document.getElementById("action").addEventListener("keypress", handleActionKeyPress);
