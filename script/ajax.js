const ajax = (url, settings, successCallback, errorCallback) => {
    fetch(url, settings)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                return errorCallback(data.error);
            }
            return successCallback(data.data);
        })
        .catch(error => {
            alert(error);
        });
}