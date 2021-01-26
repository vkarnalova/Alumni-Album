window.onload = function () {
    displayPersonalInformation();

    document.getElementById("changeInfo").addEventListener("click", function () {
        var changeInfoForm = document.getElementById("changeInfoForm");
        changeInfoForm.style.display = '';
    });

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
        window.location.href = 'myProfile.html';
    }, function (error) {
        alert(error);
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
        displayData(data);
        displayAvatar(data['username']);
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

function addListElement(info, id) {
    let ol = document.querySelector("#info");
    let li = document.createElement('li');
    li.setAttribute("id", id);
    let text = document.createTextNode(info);
    li.appendChild(text);
    ol.appendChild(li);
}
function getKeyRepresentation(key) {
    let representationString = "";
    switch (key) {
        case 'username':
            representationString = "Потребителско име";
            break;
        case 'email':
            representationString = "Имейл";
            break;
        case 'firstName':
            representationString = "Първо име";
            break;
        case 'familyName':
            representationString = "Фамилно име";
            break;
        case 'major':
            representationString = "Специалност";
            break;
        case 'class':
            representationString = "Випуск";
            break;
        case 'potok':
            representationString = "Поток";
            break;
        case 'groupNumber':
            representationString = "Група";
            break;
        case 'phoneNumber':
            representationString = "Телефонен номер";
            break;
        case 'address':
            representationString = "Адрес";
            break;
        case 'additionalInfo':
            representationString = "Допълнителна информация";
            break;
    }

    return representationString;
}