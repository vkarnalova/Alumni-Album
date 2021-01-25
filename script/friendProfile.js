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
