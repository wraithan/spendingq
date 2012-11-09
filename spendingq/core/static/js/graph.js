var handleSubmit = function() {
    var form = $('#inputForm')
    var formData = form.serializeArray()
    var data = {}
    formData.forEach(function(element) {
        data[element.name] = element.value
    })
    $.ajax({
        url: form.data('submitUrl'),
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(){
            graphUpdate()
        }
    })
    return false
}

var graphUpdate = function() {
    var graphData = []
    var i = 0
    $.get($('#content').data('profileUrl'), {format: 'json'},
          function(data) {
              data.data_points.sort(function(a, b) {
                  return a.id - b.id
              }).forEach(function(element) {
                  graphData.push([++i, element.spending_quotient])
              })
              $.plot($("#graph"), [graphData], {yaxis: {min:0}})
          }
         )
}

$(function() {
    graphUpdate()
})
