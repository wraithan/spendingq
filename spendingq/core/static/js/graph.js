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
            dataPointUpdate()
        }
    })
    $('#inputForm :input').val('')
    $('#firstInput').focus()
    return false
}

function dataPointUpdate() {
    $.get($('#content').data('profileUrl'), {format: 'json'},
          function(data) {
              var dataPoints = data.data_points.sort(function(a, b) {
                  return a.id - b.id
              })
              graphUpdate(dataPoints)
              tableUpdate(dataPoints)
          }
         )
}

function tableUpdate(dataPoints) {
    var body = $('#data-table').find('tbody')
    dataPoints.forEach(function(element) {
        body.append($('<tr>')
                    .append($('<td>')
                            .append($('<input>')
                                    .attr({type: 'checkbox',
                                           value: element.id})
                                    .addClass('hidden')))
                    .append($('<td>').text(element.average_unspent))
                    .append($('<td>').text(element.collection_rate))
                    .append($('<td>').text(element.spending_quotient)))
    })

}

var graphOptions = {
    series: {
        lines: { show: true },
        points: { show: true }
    },
    grid: { hoverable: true },
    xaxis: { tickDecimals: false },
    yaxis: { tickDecimals: false }
}

function graphUpdate(dataPoints) {
    var graphData = []
    var i = 0
    dataPoints.forEach(function(element) {
        graphData.push([++i, element.spending_quotient])
    })
    $.plot($('#graph'), [graphData], graphOptions)

}
function showTooltip(x, y, contents) {
    $('<div>').attr({
        id: 'tooltip'
    }).addClass('label').text(contents).css({
        top: y - 25,
        left: x + 5
    }).appendTo('body').fadeIn(100)

}

var previousPoint = null

$(function() {
    dataPointUpdate()
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
            previousPoint = null
        }
    })
})
