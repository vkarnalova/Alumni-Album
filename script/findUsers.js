



function findUsers(username) {
    if (username === "") {
        hideUsers();
    } else {
        var data = new FormData();
        data.append("username", username);

        const settings = {
            method: 'POST',
            body: data
        };

        ajax('src/api.php/findUsers', settings, function (data) {
            displayFoundUsers(data.data);
        }, function (error) {
            console.log(error);
            //alert(error);
        },
        );
    }
    
}

function displayFoundUsers(users) {
    
    let dropdown = document.getElementsByClassName("dropdownContent")[0];
    dropdown.style.display = "block";
    let ul = document.createElement("ul");
    dropdown.innerHTML = "";
    
    for (let i = 0; i < users.length; i++) {
        console.log(users[i].username);
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.classList.add("foundUsers");
        a.setAttribute("href", "friendProfile.html?" + users[i].username);
        let avatar = document.createElement("img"); 
        avatar.setAttribute("src", "avatars/" + users[i].username);
        avatar.setAttribute("onerror", "javascript:this.src='avatars/default.png'");
        avatar.setAttribute("width", "40");
        avatar.setAttribute("height", "40");
        a.appendChild(avatar);
        let div = document.createElement("div");
        let username = document.createTextNode(users[i].username);
        let year = document.createTextNode(users[i].class);
        div.appendChild(username);
        div.appendChild(document.createElement("br"));
        div.appendChild(year);
        a.appendChild(div);
        
        li.appendChild(a);
        ul.appendChild(li);
        
    }

    let close = document.createElement("li");
    let closeIcon = document.createElement("a");
    closeIcon.classList.add("foundUsers");
    close.setAttribute("id", "closeIcon");
    closeIcon.innerHTML = "&#10006;";
    close.appendChild(closeIcon);
    closeIcon.setAttribute("onclick", "hideUsers()");
    ul.appendChild(close);
   
    dropdown.appendChild(ul);
}

function hideUsers() {
    let dropdownContent = document.getElementsByClassName("dropdownContent")[0];
    document.getElementsByClassName("search")[0].value = "";
    
    dropdownContent.style.display = "none";
    dropdownContent.innerHTML = "";
    
}
