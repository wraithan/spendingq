function handleNewData() {
    var form = $('#input-form')
    var formData = form.serializeArray()
    var data = {}
    formData.forEach(function(element) {
        data[element.name] = element.value
    })
    $.ajax({
        url: $('#content').data('submitUrl'),
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(){
            dataPointUpdate()
        }
    })
    $('#input-form :input').val('')
    $('#first-input').focus()
    return false
}

function handleDeleteData() {
    var form = $('#delete-form')
    var formData = form.serializeArray()
    var uris = []
    formData.forEach(function(element) {
        if (element.name == 'toDelete') {
            uris.push(element.value)
        }
    })
    var msg = ('You are about to delete ' + uris.length +
               ' point(s), are you sure?')
    if (confirm(msg)) {
        $.ajax({
            url: $('#content').data('submitUrl'),
            type: 'POST',
            headers: {'X-HTTP-Method-Override': 'PATCH'},
            data: JSON.stringify({'objects': [], 'deleted_objects': uris}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(){
                dataPointUpdate()
            }
        })
    }
    return false
}

function handleSetGoal() {
    var goal = $('#goal-form').serializeArray()[0].value
    if (isNaN(goal) || (!goal && goal !== 0)) {
        alert('Goal is not a number. To disable your goal set to 0.')
        return false
    }
    $.ajax({
        url: $('#content').data('profileUrl'),
        type: 'POST',
        headers: {'X-HTTP-Method-Override': 'PATCH'},
        data: JSON.stringify({'goal': goal}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(){
            dataPointUpdate()
        }
    })
    return false
}

function dataPointUpdate() {
    $.get($('#content').data('profileUrl'), {format: 'json'},
          function(data) {
              var dataPoints = data.data_points.sort(function(a, b) {
                  return a.id - b.id
              })
              graphOptions.grid.markings = [{yaxis: {from: data.goal,
                                                     to: data.goal}}]
              $('#goal-form input')[0].value = data.goal
              graphUpdate(dataPoints)
              tableUpdate(dataPoints)
          }
         )
}

function tableUpdate(dataPoints) {
    var body = $('#data-table').find('tbody').text('')
    dataPoints.forEach(function(element) {
        body.append($('<tr>')
                    .append($('<td>')
                            .append($('<input>')
                                    .attr({type: 'checkbox',
                                           value: element.resource_uri,
                                           name: 'toDelete'}))
                            .addClass('authorized'))
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
    var actualData = []
    var averageData = []
    var i = 0
    var avgCount = 0
    var currentTotal = 0
    var oldestNumber = 0
    dataPoints.forEach(function(element, index) {
        var sq = parseFloat(element.spending_quotient)
        actualData.push([index, sq])

        currentTotal += sq
        if (avgCount===10) {
            currentTotal -= oldestNumber
            oldestNumber = sq
        } else {
            if (avgCount===0) {
                oldestNumber = sq
            }
            avgCount++
        }
        averageData.push([index, currentTotal/avgCount])
    })
    $.plot($('#graph'),
           [
               {data: actualData, label: 'SQ'},
               // {data: averageData, label: 'Avg SQ'},
           ],
           graphOptions)
    $('#graph > div.legend > table').removeAttr('style')
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
                var y = item.datapoint[1].toFixed(2)
                $('#tooltip').remove()
                showTooltip(item.pageX, item.pageY,
                            item.series.label + ': ' + y)
            }
        } else {
            $('#tooltip').remove()
            previousPoint = null
        }
    })
})
