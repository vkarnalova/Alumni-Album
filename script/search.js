window.onload = function () {
    let checkboxes = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function() {
            
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

window.onclick = function(event) {
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
    close.onclick = function() {
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

    

    ajax('src/api.php/search', settings, function (data) {
        displayFiles(data);
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
        let headingText = document.createTextNode(files[i].class);
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
        let text = document.createTextNode(files[i].user);
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