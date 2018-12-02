let buildRoundtripSearchInterface = function() {
	let body = $('body');
    body.empty();

    console.log('build search interface called');

    body.append('<div id="search_div">');
    $("#search_div").append('<input type="radio" name="Flight Type" value="round-trip">Round Trip<br>');

    $("#search_div").append('<div id="airport-selection">');
    $('#airport-selection').append('<div id="departure-section">');
    $('#airport-selection').append('<div id="destination-section">');

    $('#departure-section').append('<h1 id="departure-text">Flying from</h1>');
    $('#departure-section').append('<input type="text" id="departure-input">');
    $('#destination-section').append('<h1 id="destination-text">Flying to</h1>');
    $('#destination-section').append('<input type="text" id="destination-input">');

    $("#search_div").append('<div id="date-selection">');
    $('#date-selection').append('<div id="departure-date-selection">');
    $('#date-selection').append('<div id="return-date-selection">');

    $('#departure-date-selection').append('<h1 id="departure-date-text">Departing</h1>');
    $('#departure-date-selection').append('<input type="date" name="Departing">');
    $('#return-date-selection').append('<h1 id="return-date-text">Returning</h1>');
    $('#return-date-selection').append('<input type="date" name="Returning">');

    $('#search_div').append('<div id="flight-search-button-div">');
    $('#flight-search-button-div').append('<input type="button" id="flight-search-button" value="Search">');

}