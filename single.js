let airports = [];
selectedDepartureAirport = null;
selectedDestinationAirport = null;

let buildSingletripSearchInterface = function() {

	let body = $('body');
    body.empty();

    console.log('build search interface called');

    body.append('<div id="search_div">');
    //$("#search_div").append('<input type="radio" name="Flight Type" value="round-trip">Round Trip<br>');

    $("#search_div").append('<div id="airport-selection">');
    $('#airport-selection').append('<div id="departure-section">');
    $('#airport-selection').append('<div id="destination-section">');

    //Departure Airport Search
    $('#departure-section').append('<h1 id="departure-text">Flying from</h1>');
    $('#departure-section').append('<input type="text" id="departure-input">');
    $('#departure-section').append('<div class="departure-result-list" id="departure-result-list">');

    
    $('#destination-section').append('<h1 id="destination-text">Flying to</h1>');
    $('#destination-section').append('<input type="text" id="destination-input">');
    $('#destination-section').append('<div class="destination-result-list" id="destination-result-list">');


    $("#search_div").append('<div id="date-selection">');
    $('#date-selection').append('<div id="departure-date-selection">');
    //$('#date-selection').append('<div id="return-date-selection">');

    $('#departure-date-selection').append('<h1 id="departure-date-text">Departing</h1>');
    $('#departure-date-selection').append('<input type="date" name="Departing" id="departure-date-input">');

    // $('#return-date-selection').append('<h1 id="return-date-text">Returning</h1>');
    // $('#return-date-selection').append('<input type="date" name="Returning" id="return-date-input">');

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
		$('.selectedDepartureItem').removeClass('selectedDepartureItem');
		$(this).addClass('selectedDepartureItem');
	});

	$('.destination-list-item').on('click', function() {
		console.log($(this).attr('id'));
		selectedDestinationAirport = getIdFromListItem($(this));
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
	    // $(".departure-list-code").filter(function() {
	    //   $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    // });
	});

	$('#destination-input').on("keyup", function() {
		var value = $(this).val().toLowerCase();
		$(this).val().toLowerCase();
	    $(".destination-list-city").filter(function() {
	      $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
	    // $(".destination-list-code").filter(function() {
	    //   $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    // });
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
}