window.onload = function () {
    document.getElementById("register").addEventListener("click", event => {
        testReadFromFile()
    })
}

function testReadFromFile() {
    const file = {
        filePath: '..\\test-data\\users-data.txt',
    };

    const settings = {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `data=${JSON.stringify(file)}`
    };

    ajax('src/api.php/register', settings, function (data) {
        alert(data);
    }, function (error) {
        alert(error);
    },
    );
}