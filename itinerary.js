tickets = []

var body;

var buildItenerary = function(){

    body = $('body');
    body.empty();

    var header = $('<h1 id= "mainItenerary"> My Tickets </h1>');

    var ticketDiv = $('<div id="ticketHolder"></div>');






    var backHome = $('<button id="backHome">Go Back Home</button>').click(() =>{homePage(user);});
    body.append(backHome);
    body.append(header);
    body.append(ticketDiv);

    $.ajax(root_url + `tickets?filter[user_id]=${userId}`,
    {   type: 'GET',
        xhrFields: {withCredentials: true},
        data: {},
        success: (response) => {
            tickets = response;
            console.log(tickets);
            populateTicketList()
        }
    });


    // console.log(tickets.length);

    // for(let i = 0; i < tickets.length; i++){
    //     var fname = tickets[i].name;
    //     var gender = tickets[i].gender;
    //     var age = ticket[i].age;
    //     console.log(age);
    //     alert("this works");

    //     var tempDiv = $('<div id="ticket"></div>');

    //     tempDiv.append(age);
    //     ticketDiv.append(tempDiv);

    // }

    body.append(ticketDiv);
}

let populateTicketList = function() {
    $('body').append('<div id="ticketDiv"></div>');
    let date;
    let departTime;
    let arrivalTime;
    let departureAirport;
    let arrivalAirport;
    for(let i=0; i < tickets.length; i++){
        //Get Instance
        console.log('on ticket '+i)
        $.ajax(root_url + `instances?filter[id]=${tickets[i].instance_id}`,
        {
            type: 'GET',
            xhrFields: {withCredentials: true},
            data: {},
            success: (response) => {
                date = response[0].date;
                let flightId = response[0].flight_id;
                //Get Flight
                $.ajax(root_url + `flights?filter[id]=${flightId}`,
                {
                    type: 'GET',
                    xhrFields: {withCredentials: true},
                    data: {},
                    success: (response) => {
                        departTime = response[0].departs_at;
                        arrivalTime = response[0].arrives_at;
                        let departureId = response[0].departure_id;
                        let arrivalId = response[0].arrival_id;

                        //Get Departure Airport
                        $.ajax(root_url + `airports?filter[id]=${departureId}`,
                        {
                            type: 'GET',
                            xhrFields: {withCredentials: true},
                            data: {},
                            success: (response) => {
                                departureAirport = response[0];

                                //Get Arrival Airport
                                $.ajax(root_url + `airports?filter[id]=${arrivalId}`,
                                {
                                    type: 'GET',
                                    xhrFields: {withCredentials: true},
                                    data: {},
                                    success: (response) => {
                                        arrivalAirport = response[0];

                                        ////////////////////////////////////////
                                        //LIST FORMATTING CODE HERE
                                        $(`#ticketDiv`).append(`<div id=ticket${i}></div>`);
                                        $(`#ticket${i}`).append(`First Name: ${tickets[i].first_name}</br>`);
                                        $(`#ticket${i}`).append(`Last Name: ${tickets[i].last_name}</br>`);
                                        $(`#ticket${i}`).append(`Age: ${tickets[i].age}</br>`);
                                        $(`#ticket${i}`).append(`Date: ${date}</br>`);
                                        $(`#ticket${i}`).append(`Departure: ${departTime}</br>`);
                                        $(`#ticket${i}`).append(`Arrival: ${arrivalTime}</br>`);
                                        $(`#ticket${i}`).append(`Departure Airport: ${departureAirport.name}</br>`);
                                        $(`#ticket${i}`).append(`Arrival Airport: ${arrivalAirport.name}</br>`);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}
