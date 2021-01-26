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

    ajax('src/api.php/show-personal-information/'+user, settings, function (data) { //POSLEDNO S PARAMETUR ILI SYS SLASH???
		fillInFieldsWithInformation(data);
    }, function (error) {
        document.getElementById("infoDetails").innerHTML = "Няма открита информация.";
    },
    );
}

function fillInFieldsWithInformation(data) {
    var name = data.firstName;
    var familyName = data.familyName;
    var fullName = capitaliseFirstLetter(name) + " " + capitaliseFirstLetter(familyName);
    fillInNonNullField("fullName", fullName);

    var major = data.major;
    fillInNonNullField("majorAndClass", major);
    document.getElementById("majorAndClass").innerHTML += "\"";

    var classOf = data.class;
    document.getElementById("majorAndClass").innerHTML += ", випуск ";
    fillInNonNullField("majorAndClass", classOf);
    document.getElementById("majorAndClass").innerHTML += "г.";

    var potok = data.potok;
    fillInField("potok", potok);

    var groupNumber = data.groupNumber;
    fillInField("groupNumber", groupNumber);

    var phoneNumber = data.phoneNumber;
    fillInField("phoneNumber", phoneNumber);

    var address = data.address;
    fillInField("address", address);

    var additionalInfo = data.additionalInfo;
    fillInField("additionalInfo", additionalInfo);
}

function fillInNonNullField(fieldId, value) {
    document.getElementById(fieldId).innerHTML += value;
}

function capitaliseFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function fillInField(fieldId, value) {
    if(value != null) {
        document.getElementById(fieldId).innerHTML += value;
    } else {
        document.getElementById(fieldId).innerHTML = "";
    }
}