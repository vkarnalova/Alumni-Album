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

function displayBadges(isShown) {
	var user = location.href.substring(location.href.lastIndexOf('/') + 1); //../profila-na-mimi
	var data = new FormData();
    data.append('user', user);

    const settings = {
		method: 'POST',
        body: data
    };

	var allIcons = [];
	var count = [0, 0];
    ajax('src/api.php/show-badges', settings, function (data) {
		data.forEach(record => display(record, allIcons, count, isShown));
    }, function (error) {
        alert(error);
    },
    );
}

function display(record, allIcons, count, isShown) {
	var iconIsAlreadyDisplayed = false;
	for(var i = 0; i < allIcons.length; i++) {
		if(allIcons[i] == record.iconId) {
			displayUnderAlreadyExistingIcon(record);
			iconIsAlreadyDisplayed = true;
			break;
		}
	}
	
	if(!iconIsAlreadyDisplayed) {
		allIcons.push(record.iconId);
		displayUnderNewlyCreatedIcon(record, count, isShown);
	}
}

function displayUnderNewlyCreatedIcon(record, count, isShown) {
	var elementId = 'badgesWithIcon' + record.iconId;
	if(count[0] > 5 || (count[1] == 0 && count[0] == 0)) {
		count[1]++;
		var tr = document.createElement('tr');
		tr.id = count[1];
		var td = document.createElement('td');
		td.id = 'td' + record.iconId;
		img = document.createElement('img');
		img.id = elementId
		td.appendChild(img).src = "badge_icons/" + record.iconId + ".png";
		tr.appendChild(td);
		document.getElementById("badgesTable").appendChild(tr);
		
		if(count[1] != 0) {
			count[0] = 1;
		} else {
			count[0]++;
		}
	} else {
		var td = document.createElement('td');
		td.id = 'td' + record.iconId;
		img = document.createElement('img');
		img.id = elementId;
		td.appendChild(img).src = "badge_icons/" + record.iconId + ".png";
		document.getElementById(count[1]).appendChild(td);
		count[0]++;
	}

	addEventListenerOnClick(elementId, record.iconId, isShown);
	displayDetails(record);
}

function displayUnderAlreadyExistingIcon(record) {
	displayDetails(record);
}

function displayDetails(record) {
	var elementId = 'td' + record.iconId;
	var li = document.createElement("li");
	li.innerHTML = "👍 \"" +  record.title + "\", ";
	li.innerHTML += "възложена от "+ record.assigningUser + " ";
	if(record.description != "") {
		li.innerHTML += " (" + record.description + ")";
	}
	li.innerHTML += "<br>";
	li.className = elementId;
	document.getElementById(elementId).appendChild(li);
}

function showFullBadgeInformation(elementId) {
	document.getElementById(elementId).display = "block";
}

function hideFullBadgeInformation(elementId) {
	document.getElementById(elementId).display = "none";
}

function addEventListenerOnClick(elementId, iconId, isShown) {
	document.getElementById(elementId).addEventListener("click", event => { 
		event.preventDefault();
		showInformationBox(iconId, isShown)});
}

function showInformationBox(iconId, isShown) {
	if(isShown[iconId - 1] == false) {
		removeOtherShown(iconId, isShown);
		document.getElementById("badgesWithIcon"+iconId).style.backgroundColor = "rgba(240,148,11,0.5)";
		var listItems = document.getElementsByClassName('td'+iconId);
		for(var i = 0; i < listItems.length; i++) {
			document.getElementById("badgeDetails").innerHTML +=  listItems[i].innerHTML;
			document.getElementById("badgeDetails").style.fontWeight = "bold";
			document.getElementById("badgeDetails").style.fontStyle = "italic";
		}
		isShown[iconId - 1] = true;
	} else {
		removeOtherShown(iconId, isShown);
		document.getElementById("badgeDetails").innerHTML = "";
		document.getElementById("badgesWithIcon" + iconId).style.backgroundColor = "white";
		isShown[iconId - 1] = false;
	} 
}

function removeOtherShown(iconId, isShown) {
	document.getElementById("badgeDetails").innerHTML = "";
	for(var i = 0; i < 20; i++) {
		if(i != iconId - 1) {
			var current = document.getElementById("badgesWithIcon"+ (i + 1));
			if(current != null && isShown[i] == true) {
				document.getElementById("badgesWithIcon"+(i+1)).style.backgroundColor = "white";
				current.style.cursor = "pointer";
				isShown[i] = false;
			}
		}
	}

}
