var root_url = "http://comp426.cs.unc.edu:3001/"


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
                    alert("Login Worked");
                    homePage(user)
                    //Uncomment next line to go into roundtrip search after login
                    //buildRoundtripSearchInterface();                
                }
            });
    });


    var homePage = function(user){
        var body = $('body')
        body.empty();

        var flightContainer = $('<div id="flightContainer"></div>')


        body.append($('<h1>Home Page</h1>'));

        body.append($('<p>USER: ' +user+ '</p>')); 
        body.append($('<p1>Make a selection from the panel below: </p1>'));
        
        //Buttons
        var singleTripBTN = $('<button id = "singleBtn" class ="singleTripBTN">Single Trip</button>').click(()=>{buildSingletripSearchInterface();});
        var roundTripBTN = $('<button id = "roundBtn" class ="roundTripBTN">Round Trip</button>').click(()=>{buildRoundtripSearchInterface()});
        var iteneraryBTN = $('<button id = "itenerary" class ="iteneraryBTN">My Flights</button>').click(()=>{});

        var buttoDiv = $('<div class = "buttonDiv"></div>'); 

        buttoDiv.append(singleTripBTN);
        buttoDiv.append(roundTripBTN); 
        buttoDiv.append(iteneraryBTN); 
        
        body.append(buttoDiv); 
        body.append(flightContainer); 

       

    }
    

    $('#create_user_btn').on('click', () => {


        var body = $('body');

        body.empty();
        
        var loginDiv = $('<div class="loginDiv"></div>');
        var userDiv = $('<div class="userDiv"></div>');
        var passDiv = $('<div class="passDiv"></div>');

        body.append("<h1>Create New User</h1>");

        userDiv.append("User");
        var userIn = $('<input type="text" id="login_user" class = "user_input"></input>');
        userDiv.append(userIn); 

        passDiv.append("Password");
        var passIn = $('<input type="text" id="password_user" class = "password_input"></input>');
        passDiv.append(passIn); 

        loginDiv.append(userDiv);
        loginDiv.append(passDiv);
        body.append(loginDiv); 
        
        body.append($('<button class= "create"> Create User</button>').click(()=>{createUser()})); 

        alert("this works");
    });

});

var createUser = function(){

    var login_url = root_url + "users"; 
    var user = $('#login_user').val();
    var pass = $('#password_user').val();

    alert(user); 
    alert(pass); 

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