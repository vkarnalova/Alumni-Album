function main() {
	displayProfileInformation();
	var isShown = [];
	for(var i = 0; i < 20; i++) {
		isShown[i] = false;
	}
	var user = location.href.substring(location.href.lastIndexOf('?') + 1);
	displayBadges(isShown, user, 'src/api.php/show-badges');

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

function showBadgeSubmittionForm() {
	cleanMessages();
	document.getElementById("pageCover").style.display = "block";
	document.getElementById("badgeFormSection").style.display = "block";
}

function hideSubmittionForm() {
	document.getElementById("pageCover").style.display = "none";
	document.getElementById("badgeFormSection").style.display = "none";
	location.reload();
}

function cleanMessages() {
	document.getElementById("badgeSubmitionMessage").innerHTML = "";
}
