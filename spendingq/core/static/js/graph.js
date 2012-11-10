function handleSubmit() {
    var form = $('#inputForm')
    var formData = form.serializeArray()
    var data = {}
    formData.forEach(function(element) {
        data[element.name] = element.value
    })
    $.ajax({
        url: form.data('submitUrl'),
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(){
            graphUpdate()
        }
    })
    $('#inputForm :input').val('')
    $('#firstInput').focus()
    return false
}

var previousPoint = null

function graphUpdate() {
    var graphData = []
    var i = 0
    $.get($('#content').data('profileUrl'), {format: 'json'},
          function(data) {
              data.data_points.sort(function(a, b) {
                  return a.id - b.id
              }).forEach(function(element) {
                  graphData.push([++i, element.spending_quotient])
              })
              $.plot($('#graph'), [graphData], {
                  series: {
                      lines: {
                          show: true
                      },
                      points: {
                          show: true
                      },
                  },
                  grid: {
                      hoverable: true,
                  },
                  xaxis: {
                      tickDecimals: false
                  },
                  yaxis: {
                      min: 0,
                      tickDecimals: false
                  },
              })
          }
         )
    $('#graph').bind('plothover', function(event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex){
                previousPoint = item.dataIndex
                var x = item.datapoint[0].toFixed(2)
                var y = item.datapoint[1].toFixed(2)
                $('#tooltip').remove()
                showTooltip(item.pageX, item.pageY, y)
            }
        } else {
            $('#tooltip').remove()
            previousPoint = null;
        }
    })
}
function showTooltip(x, y, contents) {
    $('<div>').attr({
        id: 'tooltip'
    }).addClass('label').text(contents).css({
        top: y - 25,
        left: x + 5,
    }).appendTo('body').fadeIn(100)

}

$(function() {
    graphUpdate()
})
