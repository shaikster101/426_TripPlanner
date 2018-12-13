tickets = []

var body;

var ticketDiv = $('<div id="ticketDiv"></div>'); 

var buildItenerary = function(user_id, user){

    body = $('body');
    body.empty();

    var header = $('<h1 id= "mainItenerary"> My Tickets </h1>');

    var backHome = $('<button id="backHome">Go Back Home</button>').click(() =>{
        ticketDiv.empty(); 
        homePage(user);});
    body.append(backHome);
    body.append(header);
    body.append(ticketDiv);

    $.ajax(root_url + `tickets?filter[user_id]=${user_id}`,
    {   type: 'GET',
        xhrFields: {withCredentials: true},
        data: {},
        success: (response) => {
            tickets = response;
            console.log(tickets);
            populateTicketList()
        }
    });


    console.log(tickets.length);


}
var populateTicketList = function(){
    for(let i = 0; i < tickets.length; i++){
        var fname = tickets[i].first_name;
        var gender = tickets[i].gender;
        var lname = tickets[i].last_name;
        var itiId = tickets[i].itinerary_id;
        var info = tickets[i].info;
        var age = tickets[i].age;


        var tempDiv = $('<div id="ticket"></div>');

        tempDiv.append($('<br>'));
        tempDiv.append("Name: " + fname + " " +lname);
        tempDiv.append($('<br>'));
        tempDiv.append("Age: " + age);
        tempDiv.append($('<br>'));
        tempDiv.append("Gender: " + gender);
        tempDiv.append($('<br>'));
        tempDiv.append(info);
        tempDiv.append($('<br>'));
        tempDiv.append("Itinerary Id: " + itiId);
        tempDiv.append($('<br>'));
        ticketDiv.append(tempDiv);

    }

    body.append(ticketDiv);
}

// let populateTicketList = function() {
//     $('body').append('<div id="ticketDiv"></div>');
//     let date;
//     let departTime;
//     let arrivalTime;
//     let departureAirport;
//     let arrivalAirport;
//     for(let i=0; i < tickets.length; i++){
//         //Get Instance
//         console.log('on ticket '+i)
//         $.ajax(root_url + `instances?filter[id]=${tickets[i].instance_id}`,
//         {
//             type: 'GET',
//             xhrFields: {withCredentials: true},
//             data: {},
//             success: (response) => {
//                 date = response[0].date;
//                 let flightId = response[0].flight_id;
//                 //Get Flight
//                 $.ajax(root_url + `flights?filter[id]=${flightId}`,
//                 {
//                     type: 'GET',
//                     xhrFields: {withCredentials: true},
//                     data: {},
//                     success: (response) => {
//                         departTime = response[0].departs_at;
//                         arrivalTime = response[0].arrives_at;
//                         let departureId = response[0].departure_id;
//                         let arrivalId = response[0].arrival_id;

//                         //Get Departure Airport
//                         $.ajax(root_url + `airports?filter[id]=${departureId}`,
//                         {
//                             type: 'GET',
//                             xhrFields: {withCredentials: true},
//                             data: {},
//                             success: (response) => {
//                                 departureAirport = response[0];

//                                 //Get Arrival Airport
//                                 $.ajax(root_url + `airports?filter[id]=${arrivalId}`,
//                                 {
//                                     type: 'GET',
//                                     xhrFields: {withCredentials: true},
//                                     data: {},
//                                     success: (response) => {
//                                         arrivalAirport = response[0];

//                                         ////////////////////////////////////////
//                                         //LIST FORMATTING CODE HERE
//                                         $(`#ticketDiv`).append(`<div id=ticket${i}></div>`);
//                                         $(`#ticket${i}`).append(`First Name: ${tickets[i].first_name}</br>`);
//                                         $(`#ticket${i}`).append(`Last Name: ${tickets[i].last_name}</br>`);
//                                         $(`#ticket${i}`).append(`Age: ${tickets[i].age}</br>`);
//                                         $(`#ticket${i}`).append(`Date: ${date}</br>`);
//                                         $(`#ticket${i}`).append(`Departure: ${departTime}</br>`);
//                                         $(`#ticket${i}`).append(`Arrival: ${arrivalTime}</br>`);
//                                         $(`#ticket${i}`).append(`Departure Airport: ${departureAirport.name}</br>`);
//                                         $(`#ticket${i}`).append(`Arrival Airport: ${arrivalAirport.name}</br>`);
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 });
//             }
//         });
//     }
// }
