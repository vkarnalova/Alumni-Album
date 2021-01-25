function main() {
	document.getElementById("badge_form").addEventListener("submit", event => { 
	event.preventDefault();
	addBadge()});
}

function getBadgeIcon() {
	let badge_icon = document.getElementsByName("icon");
	for(var i = 0; i < badge_icon.length; i++) {
		if(badge_icon[i].checked) {
			return badge_icon[i];
		}
	}
}

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

    alert(JSON.stringify(settings));

    ajax('src/api.php/add-badge', settings, function (data) {
        alert(data);
    }, function (error) {
        alert(error);
    },
    );
}