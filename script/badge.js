function addBadge() {
    var assignedUser = location.href.substring(location.href.lastIndexOf('/') + 1); //в случай че адресът е от вида ../badge-assignment.html/profila-na-rosi
    var title = document.getElementById("badge_title").value;
    var description = document.getElementById("badge_description").value;
	var icon = getBadgeIcon();
	var iconId;

	if(icon == null) {
		iconId = "";
	} else {
		iconId = icon.id;
	}
	 
	addBadgeWithData(assignedUser, title, description, iconId);
}

function addBadgeWithData(assignedUser, title, description, iconId) {
	var data = new FormData();
    data.append('assignedUser', assignedUser);
    data.append('title', title);
    data.append('description', description);
    data.append('iconId', iconId);

    const settings = {
		method: 'POST',
        body: data
	};

    ajax('src/api.php/add-badge', settings, function (data) {
        showSuccessMessage();
    }, function (error) {
        showErrorMessage(error[0]);
    },
    );
}

function showSuccessMessage() {
	document.getElementById("badgeSubmitionMessage").style.color = "green";
	document.getElementById("badgeSubmitionMessage").innerHTML = "Значката е успешно добавена!";
}

function showErrorMessage(message) {
	document.getElementById("badgeSubmitionMessage").style.color = "red";
	if(message == "Missing input - title") {
		document.getElementById("badgeSubmitionMessage").innerHTML = "Моля, попълнете заглавие на значката!";
	} else if(message == "Missing input - iconId") {
		document.getElementById("badgeSubmitionMessage").innerHTML = "Моля, попълнете изображение за значката!";
	} else if(message == "Too long input - title") {
		document.getElementById("badgeSubmitionMessage").innerHTML = "Моля, попълнете по-кратко заглавие (до 30 символа)!";
	} else if(message == "Too long input - description") {
		document.getElementById("badgeSubmitionMessage").innerHTML = "Моля, попълнете по-кратко описание (до 255 символа)!";
	} else {
		document.getElementById("badgeSubmitionMessage").innerHTML = "Неуспешно добаване на значка!";
	}
}

function getBadgeIcon() {
	let badge_icon = document.getElementsByName("icon");
	for(var i = 0; i < badge_icon.length; i++) {
		if(badge_icon[i].checked) {
			return badge_icon[i];
		}
	}
}
