var fileList = [];

window.onload = function () {
    displayUser();
    document.getElementById("uploadImagesForm").addEventListener("submit", event => {
        event.preventDefault();
        uploadFiles();
    });
    document.getElementById("photoInput").addEventListener('change', function (evnt) {
        fileList = [];
        let photoInput = document.getElementById("photoInput");
        for (var i = 0; i < photoInput.files.length; i++) {
            fileList.push(photoInput.files[i]);
        }
    });
    document.getElementById("addTagField").addEventListener('click', function () {
        addInputTagField();
    });
}

function uploadFiles() {
    document.getElementById("messages").innerHTML = '';
    let isInputCorrect = validateInput();

    if (isInputCorrect) {
        var tags = [];
        var tagElements = document.getElementsByClassName("tag");
        for (var i = 0; i < tagElements.length; i++) {
            if (tagElements[i].value) {
                tags.push(tagElements[i].value);
            }
        }

        var photosInfo = getPhotosAdditionalInfo();

        fileList.forEach(function (file) {
            uploadFile(file, tags, photosInfo);
        });
    }
}

function uploadFile(file, tags, photosInfo) {
    var data = new FormData()
    data.append('file', file);
    data.append('tags', JSON.stringify(tags));
    data.append('photosInfo', JSON.stringify(photosInfo));

    const settings = {
        method: 'POST',
        body: data
    };

    ajax('src/api.php/upload', settings, function (data) {
        addMessage('Успешно добавяне на снимка ' + data + '.');
    }, function (error) {
        let fileName = error[1] ? " " + error[1] : '';
        addMessage('Неуспешно добавяне на снимка' + fileName + '. ' + error[0]);
    },
    );
}

function addInputTagField() {
    let tagField = document.createElement("input");
    tagField.setAttribute("type", "text");
    tagField.setAttribute("placeholder", "Tag");
    tagField.classList.add("tag");

    document.getElementById("uploadPhotosSection").insertBefore(tagField, document.getElementById("addTagField"));
    document.getElementById("uploadPhotosSection").insertBefore(document.createElement("br"), document.getElementById("addTagField"));
}

function getPhotosAdditionalInfo() {
    let major = document.getElementById("major").value ? document.getElementById("major").value : null;
    let classYear = document.getElementById("class").valueAsNumber ? document.getElementById("class").valueAsNumber : null;
    let potok = document.getElementById("potok").valueAsNumber ? document.getElementById("potok").valueAsNumber : null;
    let groupNumber = document.getElementById("groupNumber").valueAsNumber ? document.getElementById("groupNumber").valueAsNumber : null;
    let occasion = document.getElementById("occasion").value ? document.getElementById("occasion").value : null;
    var photosInfo = {
        major: major,
        class: classYear,
        potok: potok,
        groupNumber: groupNumber,
        occasion: occasion
    };

    return photosInfo;

}

function validateInput() {
    var isInputCorrect = true;
    if (!document.getElementById("class").value) {
        addMessage("Випускът е задължително поле.");
        isInputCorrect = false;
    }
    if (fileList.length == 0) {
        addMessage("Не са избрани файлове.");
        isInputCorrect = false;
    }
    return isInputCorrect;
}

function addMessage(message) {
    let errorElement = document.createElement("p");
    errorElement.classList.add("message");
    errorElement.innerHTML = message;
    document.getElementById("messages").appendChild(errorElement);
}