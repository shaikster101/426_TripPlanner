var root_url = "http://comp426.cs.unc.edu:3001/"

$(document).ready(() => {

	$('#login_btn').on('click', () => {

        var login_url = root_url + "sessions"; 
        let user = $('#login_user').val();
        let pass = $('#login_pass').val();

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
});