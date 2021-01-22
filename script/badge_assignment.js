function main() {
	document.getElementById("badge_form").addEventListener("submit", event => { 
	event.preventDefault();
	sendForm()});
	
	
	//cleanRadioButton();
}

/*function cleanRadioButton() {
	let badge_picture = document.getElementsByName("icon");
	
	for(var i = 0; i < badge_picture.length; i++) {
		if(badge_picture[i].checked == true) {
			badge_picture.checked = false;
		}
	}
}*/

function validate() {
	let input_is_valid = true;
//да добавя валидация и за дължината на описанието
	let badge_title = document.getElementById("badge_title").value; 
	if(badge_title == "") {
		console.log("Мола, попълнете име");
		input_is_valid = false;
	} 
	
	let badge_icon = document.getElementsByName("icon");
	let has_checked_button = false;
	for(var i = 0; i < badge_icon.length; i++) {
		if(badge_icon[i].checked) {
			has_checked_button = true;
		}
	}
	
	if(!has_checked_button) {
		console.log("Мола ти са да попълниш картинка");
		input_is_valid = false;
	}
	
	return input_is_valid;
}

function sendForm() {
	let input_is_valid = validate();
	if(input_is_valid) {
		console.log("heyo");
		updateDB();
		addBadgeToProfile();
	} else {
		console.log("tupo");
	}
}

function updateDB() {
	//TODO add to db
}

function addBadgeToProfile() {
	location.href = "profile_view.html";
	document.getElementById("profile_description").innerHTML += "eto, dobavil si";
}