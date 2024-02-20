"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hashtables_1 = require("../lib/hashtables");
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
    var data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : (0, hashtables_1.ph_empty)(10, (0, hashtables_1.probe_linear)(hashfunc));
    var aktivitet = {
        Month: month,
        Date: date,
        Start: start,
        End: end,
        Activity: activity
    };
    var id = (string_to_number(activity) % string_to_number(date)) - parseInt(month);
    (0, hashtables_1.ph_insert)(data, id, aktivitet);
    localStorage.setItem('data', JSON.stringify(data));
}
function add() {
    var month = document.getElementById("Month");
    var date = document.getElementById("Date");
    var start = document.getElementById("Start");
    var end = document.getElementById("End");
    var activity = document.getElementById("Activity");
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
    var month = document.getElementById("Month");
    var date = document.getElementById("Date");
    var start = document.getElementById("Start");
    var end = document.getElementById("End");
    var activity = document.getElementById("Activity");
    if (month && date && start && end && activity) {
        var month_value = month.value;
        var date_value = date.value;
        //const start_value: string = start.value;
        //const end_value: string = end.value; 
        var activity_value = activity.value;
        var id = (string_to_number(activity_value) % string_to_number(date_value)) - parseInt(month_value);
        var data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : "There is no data hahahaha";
        if ((0, hashtables_1.ph_lookup)(data, id)) {
            showMessage("du ska bli borttAGEN HALSGUGGEN :)))))");
        }
    }
}
document.getElementById("action").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        var action = document.getElementById("action").value;
        var login_form = document.getElementById("add");
        var create_form = document.getElementById("remove");
        var messageElement = document.getElementById("message");
        if (login_form && create_form && messageElement) {
            if (action === "add") {
                login_form.style.display = "block";
                create_form.style.display = "none";
            }
            else if (action === "remove") {
                login_form.style.display = "none";
                create_form.style.display = "block";
            }
            else {
                messageElement.innerText = "Invalid option. Please choose 'l' for login or 'c' for create user.";
            }
        }
    }
});
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
