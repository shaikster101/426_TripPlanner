var buildItenerary = function(){


    var body = $('body'); 
    body.empty(); 

    var header = $('<h1 id= "mainItenerary"> My Tickets </h1>');


    var ticketDiv = $('<div id="ticketHolder"></div>')

    var backHome = $('<button id="backHome">Go Back Home</button>').click(() =>{homePage(user);});
    body.append(backHome);
    body.append(header); 

}