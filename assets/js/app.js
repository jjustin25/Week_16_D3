var svgWidth = 1060;
var svgHeight = 500;
var margin = { top: 20, right: 20, bottom: 80, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chart = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data.csv", function(error, healthData) {
    if (error) throw error;
  
    console.log(healthData);
    console.log([healthData]);

	healthData.forEach(function(data){
		data.poverty = +data.poverty;
		data.healthStatus = +data.healthStatus;
    });

    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);
    
	var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
	xLinearScale.domain([0, d3.max(healthData, function(data){
		return +data.poverty;
    })]);
    
	yLinearScale.domain([0, d3.max(healthData,function(data){
		return +data.healthStatus;
    })]);

	var toolTip = d3.tip()
	  .attr("class", "toolTip")
	  .offset([50, -60])
	  .html(function(data) {
	    var state = data.state;
	    var povertyRate = +data.poverty;
	    var healthStatus = +data.healthStatus;
	    return (state + "<br> Poverty Rate: " + povertyRate + "<br> Percentage of the population in fair or poor health: " + healthStatus);
      });

      chart.call(toolTip);
      
      chart.selectAll("circle")
       .data(healthData)
       .enter()
       .append("circle")
       .attr("cx", function(data, index) {
             console.log(data.poverty);
             return xLinearScale(data.poverty);
        })
        .attr("cy", function(data, index) {
            console.log(data.healthStatus);
            return yLinearScale(data.healthStatus);
        })
        .attr("r", "12")
        .attr("fill","green")
        .style("opacity", 2)
        .on("click", function(data) {
            toolTip.show(data);
        })
        
        .on("mouseout", function(data, index) {
	    	toolTip.hide(data);
        });
        
        chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
        
        chart.append("g")
        .call(leftAxis);
        
        
        chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
        
        chart.append("text")
        .attr("transform", "translate(" + (width/3) + "," + (height + margin.top + 30) + ")") 
        .attr("class", "axisText")
        .text("In Poverty (%)");
    
});