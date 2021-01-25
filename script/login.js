window.onload = function () {
    document.getElementById("loginForm").addEventListener("submit", event => {
        event.preventDefault();
        login();
    })
}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let admin = false;
    if (document.getElementById('access').value === 'admin') {
        admin = true;
    }

    const user = {
        username,
        password,
        admin
    };

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `data=${JSON.stringify(user)}`
    };


    ajax('src/api.php/login', settings, function (data) {
        window.location.href = 'my_profile.html';
    }, function (error) {
        alert(error);
    },
    );
}