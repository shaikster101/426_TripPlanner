let airports = [];
let seats = [];
let departureAirportId; 
let destinationAirportId; 
let departureFlighCode; 
let destinationFlighCode;
let departureFlightsArr = [];
let confirmationCode = undefined;


let homeLat; 
let homeLog; 

var map;

let Dlat; 
let Dlog; 


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
	$('#airport-selection').append('<p id= "singletrip_title">Flight Details</p>');
    //Departure Airport Search
    $('#departure-section').append('<h1 id="departure-text">Flying from</h1>');
    $('#departure-section').append('<input type="text" id="departure-input" placeholder = "Search for a city">');
    $('#departure-section').append('<div class="departure-result-list" id="departure-result-list">');

	//Destination Airport Search
    $('#destination-section').append('<h1 id="destination-text">Flying to</h1>');
    $('#destination-section').append('<input type="text" id="destination-input" placeholder = "Search for a city">');
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
		selectedDepartureAirport = getIdFromListItem($(this));
		departureAirportId = getIdFromListItem($(this));
		departureFlighCode = $(this).find('.departure-list-code')[0].childNodes[0].innerHTML
		$('.selectedDepartureItem').removeClass('selectedDepartureItem');
		$(this).addClass('selectedDepartureItem');
	});

	$('.destination-list-item').on('click', function() {
		selectedDestinationAirport = getIdFromListItem($(this));
		destinationAirportId = getIdFromListItem($(this));
		destinationFlighCode = $(this).find('.destination-list-code')[0].childNodes[0].innerHTML 
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
			for(let i = 0; i < response.length; i++){
				departureFlightsArr.push(response[i]);
			}
			console.log(departureFlights);
			instanceSearch(departureFlights);
		}
	});
	getAirportCoordinates(); 
}


let getAirportCoordinates = function(){

	$.ajax(root_url + `airports?filter[code]=${departureFlighCode}`,
		{   
			type: 'GET', 
			xhrFields: {withCredentials: true}, 
			data: { 
			},
			success: (response) => {
				let dAirport = [];
				dAirport = response; 
				homeLat = dAirport[0].latitude;
				homeLog = dAirport[0].longitude;  

			}
		});
		
}

let instanceSearch = function(flights) {
	let departureDate = $('#departure-date-input').val();

	let departureInstances = [];
	console.log('start finding instances');
	let numOfSuccesses = 0;
    for(let i=0; i < flights.length; i++){
    	$.ajax(root_url + `instances?filter[flight_id]=${flights[i].id}&filter[date]=${departureDate}`,
    	// $.ajax(root_url + `instances?filter[flight_id]=263727&filter[date]=${departureDate}`, 
		{   
			type: 'GET', 
			xhrFields: {withCredentials: true}, 
			data: { 
			},
			success: (response) => {
				numOfSuccesses = numOfSuccesses+1;
				console.log(response);
				for(let j=0; j < response.length; j++){
					response[j].departs_at = flights[i].departs_at;
					response[j].arrives_at = flights[i].arrives_at;
					response[j].plane_id = flights[i].plane_id;
					departureInstances.push(response[j])
				}
				if(numOfSuccesses == flights.length){
					console.log('instances all found')
					buildConfirmationPage(departureInstances);
					
				}
			}
	    });
	}

	
	
	
}


let selectedInstance = undefined;
var buildConfirmationPage =  function(instances){
	console.log('instances below');
	// console.log(instances);

	var mapDiv = $('<div id="map"></div>')

	let departureCity = document.getElementById("li_"+departureAirportId).childNodes[1].innerHTML; 
	let destinationCity = document.getElementById("li_"+destinationAirportId).childNodes[1].innerHTML;


	let body = $('body');
	body.empty();

	var backBTN = $('<button id=goBack> Go back </button>').click(()=>{homePage(user);});

	body.append(backBTN); 
	
	body.append('<div id="AirportHolder"></div>');
	$('#AirportHolder').append('<div id = "DepartureHolder">'+ departureCity+ '</div>');
	$('#AirportHolder').append('<div id = "DestinationHolder">'+ destinationCity+ '</div>');

	body.append('<div id=FlightHolder><div>');


	console.log('length: '+instances.length);
	for(let i = 0; i < instances.length; i++){
		console.log(instances[i]);
		let departDate = new Date(instances[i].departs_at);
		let arrivalDate = new Date(instances[i].arrives_at);
		// console.log(departureDate);
		// console.log(arrivalDate);
		$('#FlightHolder').append(`
			<div class="departure-list-item" id="li_${instances[i].id}">
				<p class="departure"> Departs at: ${departDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</b></p>
				<p class="arrival"> Arrives at: ${arrivalDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</b></p>
				<p class="planeid"> Plane Id: ${instances[i].plane_id}</b></p>
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
		}
	});
	
	//..........................................

	var confirmation =$('<div id="confirmation">Confirmation Details</div><br>');
	
	body.append(confirmation); 
	body.append('First Name: <input type="text" id="confirmFirstName" ></input>' + '<br>');
	body.append('Last Name: <input type="text" id="confirmLastName" ></input>' + '<br>');
	body.append('Age: <input type="text" id="confirmAge" ></input>' + '<br>');
	body.append('Gender: <select name="Gender" id="confirmGender">'+
					'<option value="male">M</option>'+
					'<option value="female">F</option>'+
				'</select>' + '<br>');	
	body.append('Email: <input type="text" id="confirmEmail"></input>'+'<br>')
	

	var confirmBtn = $('<button id=confirmBooking> Confirm Booking</button>').click(()=>{
		finalConfirm();});

	$('.departure-list-item').on('click', function() {
		selectedInstance = getIdFromListItem($(this));
		console.log(selectedInstance);
		$('.selectedInstance').removeClass('selectedInstance');
		$(this).addClass('selectedInstance');
	});

	body.append(confirmBtn); 
	body.append(mapDiv);

	loadScript();
}


var finalConfirm = function(){
	let firstName = $('#confirmFirstName').val();
	let lastName = $('#confirmLastName').val();
	let age = $('#confirmAge').val();
	let gender = $('#confirmGender').val();
	let email = $('#confirmEmail').val();

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
			//Creating unique confirmation code for the itinerary
			let code = "";
			let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			do {
				for (var i = 0; i < 6; i++)
				code += possible.charAt(Math.floor(Math.random() * possible.length));
			} while (usedCodes.indexOf(code) != -1)
			confirmationCode = code;

			let itineraryId;
			$.ajax(root_url + 'itineraries', 
			{   
				type: 'POST', 
				xhrFields: {withCredentials: true}, 
				data: { 
					"itinerary": {
					    "confirmation_code": code,
					    "email": email
					  }
				},
				success: (response) => {
					console.log('itinerary made');

					$.ajax(root_url + `itineraries?filter[confirmation_code]=${code}`, 
					{   
						type: 'GET', 
						xhrFields: {withCredentials: true}, 
						data: { 
						},
						success: (response) => {
							console.log(code);
							console.log(response);
							itineraryId = response[0].id;
							console.log('instance: '+selectedInstance+"  itinerary: "+itineraryId);
							$.ajax(root_url + 'tickets', 
							{   
								type: 'POST', 
								xhrFields: {withCredentials: true}, 
								data: { 
									"ticket": {
									    "first_name": firstName,
									    "last_name": lastName,
									    "age": age,
									    "gender": gender,
									    "is_purchased": true,
									    "instance_id": selectedInstance,
									    "itinerary_id": itineraryId
									  }
								},
								success: (response) => {
									console.log('ticket posted');
								}
							});
						}
					});
				}
			});
		}
	});

	var body = $('body')

	body.empty(); 

	var confirmHeader = $('<h1 id= mainConfirm> Congratulations a Booking has Been confirmed, check your email for details</h1>')

	var backBtn = $('<button id=goBack> Go back </button>').click(()=>{homePage(user);});
	
	body.append(confirmHeader); 
	body.append(backBtn); 
}


function initMap() {

	var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(homeLat, homeLog)
	};

	var map = new google.maps.Map(document.getElementById('map'),
		mapOptions);
}

function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2h3SW6HJljk-cwQ3hutFYPepUq-XyUtE&callback=initMap';
	document.body.appendChild(script);
}