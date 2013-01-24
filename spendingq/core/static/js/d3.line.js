var margin = {top: 20, right: 20, bottom: 30, left: 50}
var width = 960 - margin.left - margin.right
var height = 500 - margin.top - margin.bottom

var parseDate = d3.time.format.iso.parse

var x = d3.time.scale()
    .range([0, width])

var y = d3.scale.linear()
    .range([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var line = d3.svg.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.count) })

var svg = d3.select("#statGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.json("/stats/data.json", function(error, data) {
    var total = 0
    data.forEach(function(d){
        total += d.count
        d.date = parseDate(d.when)
        d.count = total
    })

    x.domain(d3.extent(data, function(d) { return d.date }))
    y.domain(d3.extent(data, function(d) { return d.count }))

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
})
