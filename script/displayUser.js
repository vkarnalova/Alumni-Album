function displayUser() {
    
	const settings = {
        method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
    };


    ajax('src/api.php/displayUser', settings, function (data) {
        
		if (data !== null) {
            let logo = document.getElementById("logo");
            let h3 = document.createElement("h3");
            h3.innerHTML += data;
            logo.appendChild(h3);
        }
        
    }, function (error) {
        alert(error);
    },
    );
}

