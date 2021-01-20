var fileList = [];

window.onload = function () {
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
    var tags = [];
    var tagElements = document.getElementsByClassName("tag");
    for (var i = 0; i < tagElements.length; i++) {
        if (tagElements[i].value) {
            tags.push(tagElements[i].value);
        }
    }

    fileList.forEach(function (file) {
        uploadFile(file, tags);
    });
}

function uploadFile(file, tags) {
    var data = new FormData()
    data.append('file', file);
    data.append('tags', JSON.stringify(tags));

    const settings = {
        method: 'POST',
        body: data
    };

    alert(JSON.stringify(settings));

    ajax('src/api.php/upload', settings, function (data) {
        alert(data);
    }, function (error) {
        alert(error);
    },
    );
}

function addInputTagField() {
    let tagField = document.createElement("input");
    tagField.setAttribute("type", "text");
    tagField.setAttribute("placeholder", "Tag");
    tagField.classList.add("tag");

    document.getElementById("uploadImagesForm").insertBefore(tagField, document.getElementById("addTagField"));
    document.getElementById("uploadImagesForm").insertBefore(document.createElement("br"), document.getElementById("addTagField"));
}