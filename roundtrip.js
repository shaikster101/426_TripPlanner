let airports_roundtrip = [];
selectedDepartureAirport_roundtrip = null;
selectedDestinationAirport_roundtrip = null;

let buildRoundtripSearchInterface = function() {

	let body = $('#flightContainer');
    body.empty();

	
    body.append('<div id="search_div">');
    $("#search_div").append('<input type="radio" name="Flight Type" value="round-trip">Round Trip<br>');

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
    $('#date-selection').append('<div id="return-date-selection">');

    $('#departure-date-selection').append('<h1 id="departure-date-text">Departing</h1>');
    $('#departure-date-selection').append('<input type="date" name="Departing" id="departure-date-input">');
    $('#return-date-selection').append('<h1 id="return-date-text">Returning</h1>');
    $('#return-date-selection').append('<input type="date" name="Returning" id="return-date-input">');

    $('#search_div').append('<div id="flight-search-button-div">');
    $('#flight-search-button-div').append('<input type="button" id="flight-search-button" value="Search">');

    $('#flight-search-button').on('click', function(){
    	flightSearch_roundtrip();
    });

    body.append('<div id="instanceDisplayDiv">');


	retrieveAirports_roundtrip();
}


let retrieveAirports_roundtrip = function() {
	$.ajax(root_url + 'airports', 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			airports_roundtrip = response;
			buildResultList_roundtrip();         
		}
    });
}

let buildResultList_roundtrip = function() {
	for(let i=0; i < airports_roundtrip.length; i++){
		$('.departure-result-list').append(`
			<div class="departure-list-item" id="li_${airports_roundtrip[i].id}">
				<p class="departure-list-city">${airports_roundtrip[i].city}, ${airports_roundtrip[i].state}</p>
				<p class="departure-list-code"><b>${airports_roundtrip[i].code}</b> ${airports_roundtrip[i].name}</p>
			</div>
			`);
		$('.destination-result-list').append(`
			<div class="destination-list-item" id="li_${airports_roundtrip[i].id}">
				<p class="destination-list-city">${airports_roundtrip[i].city}, ${airports_roundtrip[i].state}</p>
				<p class="destination-list-code"><b>${airports_roundtrip[i].code}</b> ${airports_roundtrip[i].name}</p>
			</div>
			`);
	}

	$('.departure-list-item').on('click', function() {
		selectedDepartureAirport_roundtrip = getIdFromListItem_roundtrip($(this));
		$('.selectedDepartureItem').removeClass('selectedDepartureItem');
		$(this).addClass('selectedDepartureItem');
	});

	$('.destination-list-item').on('click', function() {
		selectedDestinationAirport_roundtrip = getIdFromListItem_roundtrip($(this));
		$('.selectedDestinationItem').removeClass('selectedDestinationItem');
		$(this).addClass('selectedDestinationItem');
	});
	registerAirportFilter_roundtrip();
}

let getIdFromListItem_roundtrip = function(item) {
	return item.attr('id').substring(3,item.attr('id').length);
}

let registerAirportFilter_roundtrip = function() {
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
let departureFlights_roundtrip = undefined;
let returnFlights_roundtrip = undefined;
let flightSearch_roundtrip = function() {
	$('#search_div').empty();
	// Get Departure Flights
	$.ajax(root_url + `flights?filter[departure_id]=${selectedDepartureAirport_roundtrip}&filter[destination_id]=${selectedDestinationAirport_roundtrip}`, 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			departureFlights_roundtrip = response;
			departureInstanceSearch_roundtrip();
		}
    });

    // Get Return Flights
	$.ajax(root_url + `flights?filter[departure_id]=${selectedDestinationAirport_roundtrip}&filter[destination_id]=${selectedDepartureAirport_roundtrip}`, 
	{   
		type: 'GET', 
		xhrFields: {withCredentials: true}, 
		data: { 
		},
		success: (response) => { 
			returnFlights_roundtrip = response;
		}
    });
}

let departureInstanceSearch_roundtrip = function() {
	let departureDate = $('#departure-date-input').val();
	// let departureDate = "2018-11-30";

	let departureInstances = [];
	let j=0;//used for counting number of successes
    for(let i=0; i < departureFlights_roundtrip.length; i++){
    	$.ajax(root_url + `instances?filter[flight_id]=${departureFlights_roundtrip[i].id}&filter[date]=${departureDate}`,
		{   
			type: 'GET', 
			xhrFields: {withCredentials: true}, 
			data: { 
			},
			success: (response) => {
				for(let k = 0; k < response.length; k++){
					response[k].departs_at = departureFlights_roundtrip[i].departs_at;
					response[k].arrives_at = departureFlights_roundtrip[i].arrives_at;
				}
				departureInstances = departureInstances.concat(response);
				if(j == departureFlights_roundtrip.length-1){
					displayDepartureInstances_roundtrip(departureInstances);
				}
				j = j+1;
			}
	    });
    }
}

let selectedDepartureInstance_roundtrip = undefined;
let displayDepartureInstances_roundtrip = function(instances) {
	$("#instanceDisplayDiv").append("<h1>Departure Flights</h1>");
	for(let i=0; i < instances.length; i++){
		$("#instanceDisplayDiv").append(`<div class="departureInstanceDisplay" id="in_${i.id}">
											<p>Departs: ${instances[i].departs_at}</p>
											<p>Arrives: ${instances[i].arrives_at}</p>
										 </div>`);
	}

	$(".departureInstanceDisplay").on("click", function() {
		selectedDepartureInstance_roundtrip = getIdFromListItem_roundtrip($(this));
		returnInstanceSearch_roundtrip()
	});
}

let returnInstanceSearch_roundtrip = function() {
	let returnDate = $('#departure-date-input').val();
	// let returnDate = "2018-12-02";

	let returnInstances = [];
	let j=0;//used for counting number of successes
    for(let i=0; i < returnFlights_roundtrip.length; i++){
    	$.ajax(root_url + `instances?filter[flight_id]=${returnFlights_roundtrip[i].id}&filter[date]=${returnDate}`,
		{   
			type: 'GET', 
			xhrFields: {withCredentials: true}, 
			data: { 
			},
			success: (response) => {
				for(let k = 0; k < response.length; k++){
					response[k].departs_at = returnFlights_roundtrip[i].departs_at;
					response[k].arrives_at = returnFlights_roundtrip[i].arrives_at;
				}
				returnInstances = returnInstances.concat(response);
				if(j == returnFlights_roundtrip.length-1){
					displayReturnInstances_roundtrip(returnInstances);
				}
				j = j+1;
			}
	    });
    }
}

let selectedReturnInstance_roundtrip = undefined;
let displayReturnInstances_roundtrip = function(instances) {
	$("#instanceDisplayDiv").empty();
	$("#instanceDisplayDiv").append("<h1>Return Flights</h1>");
	for(let i=0; i < instances.length; i++){
		$("#instanceDisplayDiv").append(`<div class="departureInstanceDisplay" id="in_${instances[i].id}">
											<p>Departs: ${instances[i].departs_at}</p>
											<p>Arrives: ${instances[i].arrives_at}</p>
										 </div>`);
	}

	$(".departureInstanceDisplay").on("click", function() {
		selectedDepartureInstance_roundtrip = getIdFromListItem_roundtrip($(this));
		$("#instanceDisplayDiv").empty();
	});
}



