function main() {
	document.getElementById("assign_badge_button").addEventListener("click", redirectToForm);

	displayBadges();
}

function displayBadges() {
	var user = location.href.substring(location.href.lastIndexOf('/') + 1); //../profila-na-mimi

	var data = new FormData();
    data.append('user', user);

    const settings = {
		method: 'POST',
        body: data
    };

    ajax('src/api.php/show-badges', settings, function (data) {
		data.forEach(record => display(record));
    }, function (error) {
       // alert(error);
    },
    );
}

function display(record) {
	document.getElementById("badgesPanel").appendChild(document.createElement('img')).src = "badge_icons/" + record.iconId + ".png";
	document.getElementById("badgesPanel").innerHTML += "<br>";
	document.getElementById("badgesPanel").innerHTML += "Значка &quot;" +  record.title + "&quot; <br>";
	document.getElementById("badgesPanel").innerHTML += "Възложена от "+ record.assigningUser + "<br>";
}

function redirectToForm() {
	location.href = "badge_assignment_form.html";
}