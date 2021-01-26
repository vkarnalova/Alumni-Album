function displayProfileInformation() {
    displayAvatar();
    retrieveInformation();
}

function displayAvatar() {
    var username = location.href.substring(location.href.lastIndexOf('/') + 1);
    var avatar;

    var avatarPNG = "avatars/"+username+".png";
    if(fileExist(avatarPNG)) {
        avatar = avatarPNG;
    } else {
        var avatarJPG = "avatars/"+username+".jpg";
        if(fileExist(avatarJPG)) {
            avatar = avatarJPG;
        } else {
            avatar = "avatars/default.png";
        }
    }

    document.getElementById("profilePicture").src = avatar;
}

function fileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function retrieveInformation() {
    var user = location.href.substring(location.href.lastIndexOf('/') + 1); //../profila-na-mimi

    const settings = {
        method: 'GET', 
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
    };

    ajax('src/api.php/show-personal-information/'+user, settings, function (data) { 
		fillInFieldsWithInformation(data);
    }, function (error) {
        document.getElementById("infoDetails").innerHTML = "Няма открита информация.";
    },
    );
}

