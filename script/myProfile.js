window.onload = function () {
    displayUser();
    displayPersonalInformation();
    var isShown = [];
	for(var i = 0; i < 20; i++) {
		isShown[i] = false;
    }
	displayMyBadges(isShown);

    document.getElementById("changeInfo").addEventListener("click", function () {
		event.preventDefault();
        showSubmittionForm();
    });

    document.getElementById("backButton").addEventListener("click", event => { 
		event.preventDefault();
		hideSubmittionForm()});

    document.getElementById("changeInfoForm").addEventListener("submit", event => {
        updateUserInformation();
    });

    document.getElementById("addAvatarInput").addEventListener("change", function () {
        // Click on the hidden upload button
        var addAvatarButton = document.getElementById('addAvatarButton');
        addAvatarButton.click();
    });

    document.getElementById("addAvatarButton").addEventListener("click", function () {
        let photo = document.getElementById("addAvatarInput").files[0];
        if (photo) {
            addAvatar(photo);
        }
    });
}

function addAvatar(photo) {
    var data = new FormData()
    data.append('file', photo);

    const settings = {
        method: 'POST',
        body: data
    };

    ajax('src/api.php/avatar', settings, function (data) {
        window.location.href = 'myProfile.html';
    }, function (error) {
        alert(error);
    },
    );
}

function updateUserInformation() {
    let potokInput = document.getElementById('potokForm').valueAsNumber;
    let groupNumberInput = document.getElementById('groupNumberForm').valueAsNumber;
    let phoneNumberInput = document.getElementById('phoneNumberForm').value;
    let addressInput = document.getElementById('addressForm').value;
    let additionalInfoInput = document.getElementById('additionalInfoForm').value;

    // if the data is not set in the form, take it from the ul or set it to null
    let potok = (potokInput) ? potokInput : null;
    let groupNumber = (groupNumberInput) ? groupNumberInput : null;
    let phoneNumber = (phoneNumberInput) ? phoneNumberInput : null;
    let address = (addressInput) ? addressInput : null;
    let additionalInfo = (additionalInfoInput) ? additionalInfoInput : null;

    const info = {
        potok,
        groupNumber,
        phoneNumber,
        address,
        additionalInfo
    };

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `data=${JSON.stringify(info)}`
    };


    ajax('src/api.php/update-user', settings, function (data) {
        showSuccessMessage();
    }, function (error) {
        showSuccessMessage();
    },
    );
}

function getElementFromInfoList(id) {
    let value = document.getElementById(id).value;
    return value ? value : null;
}

function displayPersonalInformation() {
    const settings = {
        method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
    };


    ajax('src/api.php/get-user', settings, function (data) {
        // display personal info on success
        fillInFieldsWithInformation(data);
        displayAvatar(data.username);
        if (data['admin'] == true) {
            addRegisterUsersButton();
        }
    }, function (error) {
        alert(error);
    },
    );
}

function displayData(data) {
    for (let key in data) {
        let keyRepresentation = getKeyRepresentation(key);
        if (keyRepresentation) {
            let value = data[key] != null ? data[key] : "";
            addListElement(keyRepresentation + ": " + value, key);
        }
    }
}

function displayAvatar(username) {
    document.getElementById("avatar").src = "avatars/" + username + ".png"
}

function addRegisterUsersButton() {
    let registerUsersInput = document.getElementById("registerUsersInput");
    let registerUsersButton = document.getElementById("registerUsersButton");
    if (!registerUsersInput && !registerUsersButton) {
        var label = document.createElement("label");
        label.value ="Регистрирай потребители!";
        label.setAttribute("id", "registerUsersLabel");

        registerUsersInput = document.createElement("input");
        registerUsersInput.innerHTML = "Регистрирай потребители";
        registerUsersInput.setAttribute("id", "registerUsersInput");
        registerUsersInput.setAttribute("type", "file");

        label.setAttribute("for", "registerUsersInput");
        
        registerUsersInput.addEventListener("change", function () {
            // Click on the hidden upload button
            let registerUsersButton = document.getElementById('registerUsersButton');
            registerUsersButton.click();
        });


        registerUsersButton = document.createElement("button");
        registerUsersButton.innerHTML = "Регистрирай потребители";
        registerUsersButton.setAttribute("id", "registerUsersButton");
        // This button should be hidden. We need this because we want to trigger 
        //the click event when a file is selected so that the user could select and upload a file with only one click
        registerUsersButton.style.display = 'none';
        registerUsersButton.addEventListener("click", function () {
            let file = document.getElementById("registerUsersInput").files[0];
            if (file) {
                registerUsers(file);
            }
        });

        messageAdminSection = document.createElement("section");
        messageAdminSection.setAttribute("id", "messageAdminSection");

        let adminSection = document.getElementById("adminSection");
        label.innerHTML = "Регистрирай потребители!";

        adminSection.appendChild(registerUsersInput);
        adminSection.appendChild(registerUsersButton);
        adminSection.appendChild(label);
        adminSection.appendChild(messageAdminSection);
    }
}

function registerUsers(file) {
    var data = new FormData()
    data.append('file', file);

    const settings = {
        method: 'POST',
        body: data
    };

    ajax('src/api.php/register', settings, function (data) {        
	document.getElementById("messageAdminSection").innerHTML = '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Успешно регистриране на потребители!';
        document.getElementById("messageAdminSection").style.color = "green";
        document.getElementById("messageAdminSection").style.fontStyle = "italic";
    }, function (error) {
        document.getElementById("messageAdminSection").innerHTML = 'Неуспешно регистриране на потребители.';
    },
    );
}

function showSubmittionForm() {
    	document.getElementById("reg").innerHTML = "Регистрирай потре";
    	document.getElementById("reg").style.color = "rgba(255, 255, 255, 0.3)";
	document.getElementById("pageCover").style.display = "block";
	document.getElementById("formSection").style.display = "block";
}

function hideSubmittionForm() {
    	document.getElementById("reg").innerHTML = "Регистрирай потребител!";
    	document.getElementById("reg").style.color = "white";
	document.getElementById("pageCover").style.display = "none";
    	document.getElementById("formSection").style.display = "none";
    	location.reload();
}

function showSuccessMessage() {
	document.getElementById("submitionMessage").style.color = "green";
	document.getElementById("submitionMessage").innerHTML = "Информацията е успешно обновена!";
}

function displayMyBadges(isShown) {
    var user = ""; //it's taken from session in php
    displayBadges(isShown, user, 'src/api.php/show-my-badges');
}
