var root_url = "http://comp426.cs.unc.edu:3001/"


$(document).ready(() => {

	$('#login_btn').on('click', () => {

        var login_url = root_url + "sessions"; 
        var user = $('#login_user').val();
        var pass = $('#login_pass').val();

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
                    console.log("Login Worked"); 
                }
            });
    });
    

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