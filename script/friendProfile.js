function main() {
	displayBadges();

	document.getElementById("assignBadgeButton").addEventListener("click", event => { 
		event.preventDefault();
		showBadgeSubmittionForm()});

	document.getElementById("backButton").addEventListener("click", event => { 
		event.preventDefault();
		hideSubmittionForm()});

	document.getElementById("badge_form").addEventListener("submit", event => { 
		event.preventDefault();
		addBadge()});
	
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

function showBadgeSubmittionForm() {
	cleanMessages();
	document.getElementById("pageCover").style.display = "block";
	document.getElementById("badgeFormSection").style.display = "block";
}

function hideSubmittionForm() {
	document.getElementById("pageCover").style.display = "none";
	document.getElementById("badgeFormSection").style.display = "none";
}

function cleanMessages() {
	document.getElementById("badgeSubmitionMessage").innerHTML = "";
}
