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


function profileUpdate(){
    $.get($('#content').data('profileUrl'), {format: 'json'},
          function(data) {
              graphOptions.grid.markings = [{yaxis: {from: data.goal,
                                                     to: data.goal}}]
              $('#goal-form input')[0].value = data.goal
          }
         )
}

function dataPointUpdate() {
    profileUpdate()
    $.get($('#content').data('dataUrl'),
          function(data) {
              graphUpdate(data, $('#goal-form input')[0].value)
              tableUpdate(data)
          }
         )
}

function initialGraph() {
    var data = $('#content').data('initial-data')
    if (data) {
        console.log('using initial data')
        graphUpdate(data, $('#goal-form input')[0].value)
        tableUpdate(data)
    } else {
        console.log('No initial data found, making an ajax request.')
        dataPointUpdate()
    }
}

function tableUpdate(dataPoints) {
    var body = $('#data-table').find('tbody').text('')
    dataPoints.forEach(function(element) {
        body.append($('<tr>')
                    .append($('<td>')
                            .append($('<input>')
                                    .attr({type: 'checkbox',
                                           value: '/api/datapoint/' + element.id + '/',
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

function graphUpdate(dataPoints, goal) {
    var actualData = []
    var averageData = []
    var i = 0
    var avgCount = 0
    var avgSet = []
    var avgTotal = 0
    var min = goal
    var max = goal
    dataPoints.forEach(function(element, index) {
        var sq = parseFloat(element.spending_quotient)
        actualData.push([index, sq])

        if (avgCount===10){
            avgTotal -= avgSet.shift()
        }
        avgCount = avgSet.push(sq)
        avgTotal += sq
        averageData.push([index, avgTotal/avgCount])
        if (min > sq) {
            min = sq
        } else if (max < sq) {
            max = sq
        }
    })
    graphOptions.yaxis.min = (min - 5)
    graphOptions.yaxis.max = (max + 5)
    var graphData = []
    if ($('#sq-line').attr('checked')) {
        graphData.push({data: actualData, label: 'SQ', color: 0})
    }
    if ($('#avg-line').attr('checked')) {
        graphData.push({data: averageData, label: 'Avg SQ', color: 1})
    }

    $.plot($('#graph'), graphData, graphOptions)
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
    initialGraph()
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
