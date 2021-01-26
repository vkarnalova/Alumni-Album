window.onload = function () {
    let checkboxes = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function () {

            updateInputFields(this.value, !this.checked);

        });
    }


    document.getElementById("filterForm").addEventListener("submit", event => {
        event.preventDefault();
        clearFiles();
        searchFiles(checkboxes);
    });

    document.getElementById("addTagField").addEventListener("click", function () {
        addTagField();
    });

    document.getElementsByClassName("close")[0].addEventListener("click", function () {
        let popup = document.getElementById("popup");
        popup.removeChild(popup.childNodes[0]);
    });


}

window.onclick = function (event) {
    let popup = document.getElementById("popup");
    if (event.target == popup) {
        popup.style.display = "none";
    }

}

function viewPicture(src) {
    let popup = document.getElementById("popup");
    let close = document.getElementsByClassName("close")[0];
    popup.style.display = "block";
    let file = document.getElementById("image");
    file.setAttribute("src", src);
    close.onclick = function () {
        popup.style.display = "none";
    }


}



function updateInputFields(value, flag) {
    document.getElementById(value).disabled = flag;
    if (value === "tags") {
        document.getElementById("addTagField").disabled = flag;
        let tags = document.getElementsByClassName("tag");
        for (let j = 0; j < tags.length; j++) {
            tags[j].disabled = flag;
        }
    }
}

function addTagField() {
    let tagLabel = document.createElement("label");
    tagLabel.setAttribute("for", "tags");
    let tagField = document.createElement("input");
    tagField.setAttribute("type", "text");
    tagField.setAttribute("name", "tag");
    tagField.setAttribute("placeholder", "таг");
    tagField.classList.add("tag");
    tagLabel.appendChild(tagField);
    document.getElementById("filterForm").insertBefore(tagLabel, document.getElementById("addTagField"));
}

function searchFiles(checkboxes) {
    var data = new FormData();
    for (let i = 0; i < checkboxes.length; i++) {

        if (checkboxes[i].value === "tags" && checkboxes[i].checked) {
            let tags = document.getElementsByClassName("tag");
            let tagsInput = [];
            for (let i = 0; i < tags.length; i++) {
                tagsInput[i] = tags[i].value;
            }

            data.append(checkboxes[i].value, tagsInput);
        }

        if (checkboxes[i].checked) {
            const attribute = checkboxes[i].value;
            const value = document.getElementById(checkboxes[i].value).value;
            data.append(attribute, value);
        }

    }


    const settings = {
        method: 'POST',
        body: data
    };



    ajax('src/api.php/search', settings, function (data, query) {
        displayFiles(data);
        if (data.length > 0) {
            createPdfButton();
        } else {
            hidePdfButton();
        }
    }, function (error) {
        alert(error);
    },
    );
}

function displayFiles(files) {
    let section = document.getElementById("photos");
    for (let i = 0; i < files.length; i++) {
        let article = document.createElement("article");
        article.classList.add("photoArticle");

        let header = document.createElement("header");
        let heading = document.createElement("h3");
        let headingText = document.createTextNode("випуск");
        heading.appendChild(headingText);
        header.appendChild(heading);
        article.appendChild(header);

        let div = document.createElement("div");
        let photo = document.createElement("img");
        let src = "uploads/" + files[i].name;
        photo.setAttribute("src", src);
        photo.setAttribute("onclick", "viewPicture(this.src)");
        photo.classList.add("photos");
        div.appendChild(photo);
        article.appendChild(div);

        let span = document.createElement("span");
        let text = document.createTextNode("user");
        span.appendChild(text);
        article.appendChild(span);




        section.appendChild(article);
    }
}

function clearFiles() {
    document.getElementById("photos").innerHTML = "";
    //let files = document.getElementsByClassName("photoArticle");
    //for (let i = 0; i < files.length; i++) {
    //document.getElementById("photos").removeChild(files[i]);
    //}
}

function createPdfButton() {
    let createPdfButton = document.getElementById("createPdf");
    if (!createPdfButton) {
        createPdfButton = document.createElement("BUTTON");
        createPdfButton.innerHTML = "Свали снимките в pdf формат";
        createPdfButton.setAttribute("id", "createPdf");

        createPdfButton.addEventListener("click", function () {
            createPdfFile();
        })

        document.getElementsByClassName("photoSection")[0].appendChild(createPdfButton);
    }
}

function hidePdfButton() {
    let createPdfButton = document.getElementById("createPdf");
    if (createPdfButton) {
        createPdfButton.style.display = 'none';
    }
}

function createPdfFile() {
    let pdf = new jsPDF('landscape', 'pt', 'a4');
    let photos = document.getElementsByClassName("photoSection")[0].getElementsByTagName('img');

    let currentPhotoOnRow = 0;
    let currentRow = 0;
    for (let i = 0; i < photos.length; i++) {

        // There are 6 photos on one page
        if (i != 0 && i % 6 == 0) {
            pdf.addPage();
            currentPhotoOnRow = 0;
            currentRow = 0;
        }
        // There are 3 photos on one row 
        else if (i != 0 && i % 3 == 0) {
            currentPhotoOnRow = 0;
            currentRow++
        }

        let img = new Image();
        let src = photos[i].getAttribute('src');
        img.src = src;
        let extension = src.split('.').pop()
        pdf.addImage(img, extension, 15 + currentPhotoOnRow * 280, 20 + 300 * currentRow, 250, 250, i, "FAST");
        currentPhotoOnRow++;
    }

    pdf.save("photos-" + new Date().toLocaleDateString() + ".pdf");
    console.log("done");
}