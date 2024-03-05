 

import { ph_empty, ph_insert, probe_linear, HashFunction, ph_lookup, ph_delete } from "../ Lib/hashtables";
//import { saveCredentials, handleActionKeyPress2 } from "./LifeHub_albin";

import { ActivityTable, string_to_number , Activity,}  from "./LifeHub"
 
let mock_storage: {[key: string]: ActivityTable} = {};
     // creating a storage similar to the local storage in a node.js enviroment

let Global_username: string = "Albin";
     // creating a global_username that gets stored when you log in to keep the diffrent datas separate

     const hashfunc: HashFunction<number> = key => key // 


let credentials: { [key: string]: string } = {}
  

     function saveCredentials_changed(username: string, password: string): void 
    {
        //const credentials: { [key: string]: string } = localStorage.getItem('credentials') ? JSON.parse(localStorage.getItem('credentials') as string) : {};
        //credentials[username] = password;
        //localStorage.setItem('credentials', JSON.stringify(credentials));
        credentials[username] = password;
        
    }
   
    function makeData_changed(month: string, date: string, start: string, end: string, activity: string): void {
        const hashfunc: HashFunction<number> = key => key 
        //const data_con: string = localStorage.getItem(Global_username + '_data') as string;
        //const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
        const data: ActivityTable = mock_storage[Global_username + '_data'] ? mock_storage[Global_username + '_data'] : ph_empty(10, probe_linear(hashfunc));// for testing sake we just create a empty hashtable 
        data.probe = probe_linear(hashfunc);
        const aktivitet: Activity = {
            Month: month,
            Date: date,
            Start: start,
            End: end,
            Activity: activity
        };
        const id: number = (string_to_number(activity) + string_to_number(month)) - parseInt(date);
         
        ph_insert(data, id, aktivitet);
        //localStorage.setItem(Global_username + '_data', JSON.stringify(data)); // cant add the data to local storage
        mock_storage[Global_username + '_data'] = data; // saving the data in storage created in file
    }
    
     
    function add_changed(month_value: string, date_value: string, start_value: string, end_value: string, activity_value: string ): void 
     {
        //added parameters instead of HTMLINputs because we are in node.js which cant read document files

        //const month: HTMLInputElement | null = document.getElementById("Month_a") as HTMLInputElement;
        //const date: HTMLInputElement | null = document.getElementById("Date_a") as HTMLInputElement;
        //const start: HTMLInputElement | null = document.getElementById("Start_a") as HTMLInputElement;
        //const end: HTMLInputElement | null = document.getElementById("End_a") as HTMLInputElement;
        //const activity: HTMLInputElement | null = document.getElementById("Activity_a") as HTMLInputElement;
    
        //if (month && date && start && end && activity) {
            //const month_value: string = month.value;
            //const date_value: string = date.value;
            //const start_value: string = start.value;
            //const end_value: string = end.value;
            //const activity_value: string = activity.value;
            makeData_changed(month_value, date_value, start_value, end_value, activity_value);
        }

        function remove_changed(month_value: string, date_value: string, activity_value: string): void {

            // adding parameters instead of HTMLinputs because Node.js cant take document files

            //const month: HTMLInputElement | null = document.getElementById("Month_r") as HTMLInputElement;
            //const date: HTMLInputElement | null = document.getElementById("Date_r") as HTMLInputElement;
            //const activity: HTMLInputElement | null = document.getElementById("Activity_r") as HTMLInputElement;
        
            //if (month && date && activity) {
                //const month_value: string = month.value;
                //const date_value: string = date.value; 
                //const activity_value: string = activity.value;
        
                const id: number = (string_to_number(activity_value) + string_to_number(month_value)) - parseInt(date_value);
                const hashfunc: HashFunction<number> = key => key

                //const data_con: string = localStorage.getItem(Global_username + '_data') as string;
                //const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
                
                // because we dont need to convert the hashtable from the local storage on the browser we can just take the file 
                // from our local storage
                const data: ActivityTable = mock_storage[Global_username + '_data'] ? mock_storage[Global_username + '_data'] : ph_empty(10, probe_linear(hashfunc));
                data.probe = probe_linear(hashfunc);
                 
                if (ph_lookup(data, id)) {
                    //showMessage("Aktiviteten har blivit bortagen")
                    ph_delete(data, id);
                    //localStorage.setItem(Global_username + '_data', JSON.stringify(data));
                }
            }
            /*
            function search_changed(searchMonth: string, searchDate: string): void {
    
                //const searchMonthInput: HTMLInputElement | null = document.getElementById("search_month") as HTMLInputElement;
                //const searchDateInput: HTMLInputElement | null = document.getElementById("search_date") as HTMLInputElement;
                //const messageElement: HTMLElement | null = document.getElementById("message");
            
                //if (searchMonthInput && searchDateInput && messageElement) {
                   // const searchMonth: string = searchMonthInput.value;
                   // const searchDate: string = searchDateInput.value;
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
                */
                function searchActivity_changed(month: string, date: string): Activity[] {
                    const hashfunc: HashFunction<number> = key => key;
                     
                    //let data: ActivityTable = localStorage.getItem(Global_username + '_data') ? JSON.parse(localStorage.getItem(Global_username + '_data') as string) : ph_empty(10, probe_linear(hashfunc));
                    const data: ActivityTable = mock_storage[Global_username + '_data'] ? mock_storage[Global_username + '_data'] : ph_empty(10, probe_linear(hashfunc));
                    data.probe = probe_linear(hashfunc);
                    const activities: Activity[] = [];
                    
                      
                
                    for (let i = 0; i < data.keys.length; i++) {
                        const key = data.keys[i];
                        
                        if (key !== null && key !== undefined) {
                            const storedActivity = ph_lookup(data, key);
                             
                            
                            if (storedActivity && storedActivity.Month === month && storedActivity.Date === date) {
                                activities.push(storedActivity);
                            }
                        }
                    }
                    
                    return activities; // Return array of activities for the specified date
                }
            
 

test("create a user", () => {
     
    saveCredentials_changed("användarnamn", "lösenord");
     
    expect(credentials["användarnamn"] === "lösenord").toBe(true);
    
});

test("make some data", () => {
    
    makeData_changed("january", "23", "13:00", "15:00", "Fotboll");
    const calendar_data: ActivityTable = mock_storage[Global_username + '_data'];
    expect(calendar_data.data).toContainEqual({Month: "january", Date: "23", Start: "13:00", End: "15:00", Activity: "Fotboll"})
});

test("add a activity", () => {

        
        add_changed("january", "23", "13:00", "14:00", "Football");
        const calendar_data: ActivityTable = mock_storage[Global_username + '_data']; // accesing the correct users data
        expect(calendar_data.data).toContainEqual({Month: "january", Date: "23", Start: "13:00", End: "14:00", Activity: "Football"});


} );

test("remove activity", () => {
    add_changed("january", "25", "13:00", "14:00", "Handball");
        const calendar_data: ActivityTable = mock_storage[Global_username + '_data']; // accesing the correct users data
        expect(calendar_data.data).toContainEqual({Month: "january", Date: "25", Start: "13:00", End: "14:00", Activity: "Handball"});
    remove_changed("januray", "25", "Handball");

    expect(calendar_data).toBeUndefined;

     
});

test("search for activity ", () => {
    add_changed("january", "27", "13:00", "14:00", "Icehockey")

    expect(searchActivity_changed("january", "27")).toContainEqual({Month: "january", Date: "27", Start: "13:00", End: "14:00", Activity: "Icehockey"});
});

test("Local storage work with jest", () => {
    makeData("january", "23", "13:00", "15:00", "Fotboll");
    const data_con: string = localStorage.getItem(Global_username + '_data') as string;
    const data: ActivityTable = data_con ? JSON.parse(data_con) : ph_empty(10, probe_linear(hashfunc));
    data.probe = probe_linear(hashfunc);
    expect(data).toContain({Month: "january", Date: "23", Start: "13:00", End: "15:00", Activity: "Fotboll"});

})