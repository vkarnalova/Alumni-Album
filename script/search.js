window.onload = function () {
    

    document.getElementById("filterForm").addEventListener("submit", event => {
        event.preventDefault();
        searchFiles();
    });

    document.getElementById("addTagField").addEventListener("click", function () {
        addTagField();
    });

    
    
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

function searchFiles() {
    let majorInput = document.getElementById("major").value;
    let classInput = document.getElementById("class").value;
    let potokInput = document.getElementById("potok").value;
    let groupNumberInput = document.getElementById("groupNumber").value;
    let occasionInput = document.getElementById("occasion").value;
    let tags = document.getElementsByClassName("tag");
    let tagsInput = [];
    for (let i = 0; i < tagsInput.length; i++) {
        tagsInput[i] = tags[i].value;
    }
    
    
    const file = {
        major: majorInput,
        class: classInput,
        potok: potokInput,
        groupNumber: groupNumberInput,
        occasion: occasionInput,
		tags: tagsInput
    };

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `data=${JSON.stringify(file)}`
    };

    

    ajax('src/api.php/search', settings, function (data) {
        alert(data);
    }, function (error) {
        alert(error);
    },
    );
}