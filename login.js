var root_url = "http://comp426.cs.unc.edu:3001/"
let userId = undefined;

let user; 
$(document).ready(() => {

    $('#login_btn').on('click', () => {

        var login_url = root_url + "sessions"; 
        var user = $('#login_user').val();
        var pass = $('#login_pass').val();
        $.ajax(login_url, 
            {   type: 'POST', 
                xhrFields: {withCredentials: true}, 
                data: { "user": {
                        "username": user, //our username
                        "password": pass //our password
            }
                },
                success: (response) => { 
                   
                    homePage(user)
                    //Uncomment next line to go into roundtrip search after login
                    //buildRoundtripSearchInterface();   
                }
            });
    });


   
    

    $('#create_user_btn').on('click', () => {


        var body = $('body');

        body.empty();
        
        var loginDiv = $('<div class="loginDiv"></div>');
        var userDiv = $('<div class="userDiv"></div>');
        var passDiv = $('<div class="passDiv"></div>');
        var creationDiv = $('<div class ="createDiv"></div>');
        body.append("<h1>Make an Account</h1>");

        userDiv.append("Username:");
        var userIn = $('<input type="text" id="login_user" class = "user_input"></input>');
        userDiv.append(userIn); 

        passDiv.append("Password:");
        var passIn = $('<input type="text" id="password_user" class = "password_input"></input>');
        passDiv.append(passIn); 

        loginDiv.append(userDiv);
        loginDiv.append(passDiv);
        body.append(loginDiv); 
        
        body.append($('<button class= "create"> Create Account</button>').click(()=>{createUser()})); 
        body.append($('<button class= "create2"> Go back to login page</button>').click(() =>{window.location.reload()}));
       
        body.append(creationDiv);

        
    });

});



var createUser = function(){

    var login_url = root_url + "users"; 
    user = $('#login_user').val();
    var pass = $('#password_user').val();
    $('.createDiv').append("User Created")
   

    $.ajax(login_url, 
        {   type: 'POST', 
            xhrFields: {withCredentials: true}, 
            data: { "user": {
                    "username": user, //our username
                    "password": pass //our password
        }
            },
            success: (response) => { 
                console.log("Creation Worked"); 
            }
    });
}

var homePage = function(user){
    var body = $('body')
    body.empty();
    body.removeClass("loginbody");
    body.addClass("homepagebody");
    var flightContainer = $('<div id="flightContainer"></div>')
    var logoutBtn = $('<button id = "logout">Logout</button>').click(() =>{window.location.reload()});
    body.append(logoutBtn);
    
    
    

    body.append($('<h1>Tar Heel Travel Planner</h1>'));

    body.append($('<p>You are logged in as: ' +user+ '</p>')); 
    body.append($('<p1>Make a selection from the panel below: </p1>'));
   // body.append($('<img id = "cloud" src = "cloud image.png">'))
    //Buttons
    var singleTripBTN = $('<button id = "singleBtn" class ="singleTripBTN">Single Trip</button>').click(()=>{buildSingletripSearchInterface();});
    //var roundTripBTN = $('<button id = "roundBtn" class ="roundTripBTN">Round Trip</button>').click(()=>{buildRoundtripSearchInterface()});
    var iteneraryBTN = $('<button id = "itenerary" class ="iteneraryBTN">My Flights</button>').click(()=>{buildItenerary();});

    var buttoDiv = $('<div class = "buttonDiv"></div>'); 

    buttoDiv.append(singleTripBTN);
    //buttoDiv.append(roundTripBTN); 
    buttoDiv.append(iteneraryBTN); 
    
    body.append(buttoDiv); 
    body.append(flightContainer); 

    $.ajax(root_url + `users?filter[username]=${user}`, 
    {   type: 'GET', 
        xhrFields: {withCredentials: true}, 
        data: {},
        success: (response) => { 
            userId = response.id;
        }
    });
   

}