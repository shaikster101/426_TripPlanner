let airports = [];
let seats = [];
let departureAirportId; 
let destinationAirportId; 
let departureFlightsArr = [];
let confirmationCode = undefined;


selectedDepartureAirport = null;
selectedDestinationAirport = null;

let buildSingletripSearchInterface = function() {

	let body = $('#flightContainer');
    body.empty();

    console.log('build search interface called');

    body.append('<div id="search_div">');

    $("#search_div").append('<div id="airport-selection">');
    $('#airport-selection').append('<div id="departure-section">');
    $('#airport-selection').append('<div id="destination-section">');
	$('#airport-selection').append('<p id= "singletrip_title">Book a flight for a single trip</p>');
    //Departure Airport Search
    $('#departure-section').append('<h1 id="departure-text">Flying from</h1>');
    $('#departure-section').append('<input type="text" id="departure-input">');
    $('#departure-section').append('<div class="departure-result-list" id="departure-result-list">');

	//Destination Airport Search
    $('#destination-section').append('<h1 id="destination-text">Flying to</h1>');
    $('#destination-section').append('<input type="text" id="destination-input">');
    $('#destination-section').append('<div class="destination-result-list" id="destination-result-list">');

	//Date Selection
    $("#search_div").append('<div id="date-selection">');
    $('#date-selection').append('<div id="departure-date-selection">');
    $('#departure-date-selection').append('<h1 id="departure-date-text">Departing</h1>');
    $('#departure-date-selection').append('<input type="date" name="Departing" id="departure-date-input">');


    $('#search_div').append('<div id="flight-search-button-div">');
    $('#flight-search-button-div').append('<input type="button" id="flight-search-button" value="Search">');

    $('#flight-search-button').on('click', function(){
    	flightSearch();
    });

	retrieveAirports();
}


let retrieveAirports = function() {
	$.ajax(root_url + 'airports', 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			airports = response;
			buildResultList();         
		}
    });
}

let buildResultList = function() {
	for(let i=0; i < airports.length; i++){
		$('.departure-result-list').append(`
			<div class="departure-list-item" id="li_${airports[i].id}">
				<p class="departure-list-city">${airports[i].city}, ${airports[i].state}</p>
				<p class="departure-list-code"><b>${airports[i].code}</b> ${airports[i].name}</p>
			</div>
			`);
		$('.destination-result-list').append(`
			<div class="destination-list-item" id="li_${airports[i].id}">
				<p class="destination-list-city">${airports[i].city}, ${airports[i].state}</p>
				<p class="destination-list-code"><b>${airports[i].code}</b> ${airports[i].name}</p>
			</div>
			`);
	}

	$('.departure-list-item').on('click', function() {
		console.log($(this).attr('id'));
		selectedDepartureAirport = getIdFromListItem($(this));
		departureAirportId = getIdFromListItem($(this));
		$('.selectedDepartureItem').removeClass('selectedDepartureItem');
		$(this).addClass('selectedDepartureItem');
	});

	$('.destination-list-item').on('click', function() {
		console.log($(this).attr('id'));
		selectedDestinationAirport = getIdFromListItem($(this));
		destinationAirportId = getIdFromListItem($(this));
		$('.selectedDestinationItem').removeClass('selectedDestinationItem');
		$(this).addClass('selectedDestinationItem');
	});
	registerAirportFilter();
}

let getIdFromListItem = function(item) {
	return item.attr('id').substring(3,item.attr('id').length);
}

let registerAirportFilter = function() {
	//Can't apply two different filters at once?
	$('#departure-input').on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(this).val().toLowerCase();
	    $(".departure-list-city").filter(function() {
	      $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
	});

	$('#destination-input').on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(this).val().toLowerCase();
	    $(".destination-list-city").filter(function() {
	      $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
	});
}

let flightSearch = function() {

	// Get Departure Flights
	let departureFlights = undefined;
	$.ajax(root_url + `flights?filter[departure_id]=${selectedDepartureAirport}&filter[destination_id]=${selectedDestinationAirport}`, 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			departureFlights = response;
			console.log(departureFlights);
			for(let i = 0; i < response.length; i++){
				departureFlightsArr.push(response[i]);
			}
			console.log(departureFlightsArr[20]);
			instanceSearch(departureFlights);
		}
    });
}

let instanceSearch = function(flights) {
	let departureDate = $('#departure-date-input').val();

	console.log(departureDate);
	let departureInstances = [];
    for(let i=0; i < flights.length; i++){
    	$.ajax(root_url + `instances?filter[flight_id]=${flights[i].id}&filter[date]=${departureDate}`,
    	// $.ajax(root_url + `instances?filter[flight_id]=263727&filter[date]=${departureDate}`, 
		{   
			type: 'GET', 
			xhrFields: {withCredentials: true}, 
			data: { 
			},
			success: (response) => {
				console.log('flight_id: '+flights[i].id+"  "+'date: '+departureDate);
				for(let j=0; j < response.length; j++){
					departureInstances.push(response[i])
				}
				console.log(response);
			}
	    });
	}
	
	buildConfirmationPage(departureFlightsArr, airports);
}

var buildConfirmationPage =  function(departureFlightsArr){
	


	let departureCity = document.getElementById("li_"+departureAirportId).childNodes[1].innerHTML; 
	let destinationCity = document.getElementById("li_"+destinationAirportId).childNodes[1].innerHTML;

	console.log(departureFlightsArr[0]); 
	let body = $('body');
	body.empty();

	var backBTN = $('<button id=goBack> Go back </button>').click(()=>{
		buildSingletripSearchInterface();});

	body.append(backBTN); 
	
	body.append('<div id="AirportHolder"></div>');
	$('#AirportHolder').append('<div id = "DepartureHolder">'+ departureCity+ '</div>');
	$('#AirportHolder').append('<div id = "DestinationHolder">'+ destinationCity+ '</div>');

	body.append('<div id=FlightHolder> Flights Holder<div>');



	for(let i = 0; i < departureFlightsArr.length; i++){
		let departDate = new Date(departureFlightsArr[i].departs_at);
		let returnDate = new Date(departureFlightsArr[i].arrives_at);
		$('#FlightHolder').append(`
			<div class="departure-list-item" id="li_${departureFlightsArr[i].id}">
				<p class="departure"> Deaprts at: ${departDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</b></p>
				<p class="arrival"> Arrives at:${returnDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</b></p>
				<p class="departure"> Plane Id: ${departureFlightsArr[i].plane_id}</b></p>
			</div>
			`);
	}

	//..................
	$.ajax(root_url + 'seats', 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			seats = response;
			console.log(seats[0])	      
		}
	});
	
	//..........................................


	var confirmation =$('<div id="confirmation">Confirmation Details</div><br>');
	

	body.append(confirmation); 
	body.append('<input type="text" id="Name" ></input>' + '<br>');
	body.append('<input type="text" id="Email"></input>'+'<br>')

	var confirmBtn = $('<button id=confirmBooking> Confirm Booking</button>').click(()=>{
		finalConfirm();});

	body.append(confirmBtn); 



}


var finalConfirm = function(){
	//Creating unique confirmation code for the itinerary
	let emailInput = $('#Email').val();
	let nameInput = $('#Name').val();

	let itineraryFinishedLoading = false;
	$.ajax(root_url + 'itineraries', 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			let usedCodes = [];
			for(let  i=0; i < response.length; i++){
		      	usedCodes.push(response[i].confirmation_code)
			}

			let code = "";
			let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

			do{
				for (var i = 0; i < 6; i++)
				code += possible.charAt(Math.floor(Math.random() * possible.length));
			} while (usedCodes.indexOf(code) != -1)
			confirmationCode = code;

			$.ajax(root_url + 'itineraries', 
			{   
				type: 'POST', 
				xhrFields: {withCredentials: true}, 
				data: { 
					"itinerary": {
					    "confirmation_code": code,
					    "email": emailInput
					  }
				},
				success: (response) => {
					console.log('itinerary made');

					$.ajax(root_url + `itineraries?filter[confirmationCode]=${code}`, 
					{   
						type: 'GET', 
						xhrFields: {withCredentials: true}, 
						data: { 
						},
						success: (response) => {
							console.log(response);
						}
					});
				}
			});

			$.ajax(root_url + `itineraries?filter[confirmationCode]=${code}`, 
			{   
				type: 'GET', 
				xhrFields: {withCredentials: true}, 
				data: { 
				},
				success: (response) => {
					console.log(response);
				}
			});

		}
	});

	var body = $('body')

	body.empty(); 

	var confirmHeader = $('<h1 id= mainConfirm> Congratulations a Booking has Been confirmed, check your email for details</h1>')

	var backBtn = $('<button id=goBack> Go back </button>').click(()=>{
		buildSingletripSearchInterface();});
	
	body.append(confirmHeader); 
	body.append(backBtn); 


}

