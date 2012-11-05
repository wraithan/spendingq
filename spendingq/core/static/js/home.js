var handleForm = function(form) {
}

var handleSubmit = function() {
    var form = $('inputForm')
    $.get(form.data('submitUrl'),
          {format: 'json'},
          function(data) {
              alert(data)
          })
}

var onLoad = function() {
    document.getElementById('submit').addEventListener('click', handleSubmit)
}

document.addEventListener('DOMContentLoaded', function() {onLoad()})
