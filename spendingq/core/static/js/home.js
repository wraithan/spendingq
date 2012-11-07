var form = ''


var handleSubmit = function() {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                alert(httpRequest.responseText)
            } else {
                alert('There was a problem with the request.')
            }
        }
    }
    httpRequest.open('GET', form.dataset.submitUrl + '?format=json')
    httpRequest.send(null)
}

var onLoad = function() {
    document.getElementById('submit').addEventListener('click', handleSubmit)
    form = document.getElementById('inputForm')
}

document.addEventListener('DOMContentLoaded', function() {onLoad()})
