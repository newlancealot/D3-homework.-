// Set up SVG Area
var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top -margin.bottom;

//Implementing SVG Wrapper and adding SVG group to hold chart

var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height",svgHeight);

var chartGroup = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Import Data
d3.csv("incomevsbachelor.csv", function(err, csvdata) {
    if (err) throw err;

    // Parse Data as Numbers
    csvdata.forEach(function(data){
        data.bac_34to44 = +data.bac_34to44
        data.fifty_k_plus = +data.fifty_k_plus;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(csvdata, d => d.bac_34to44)])
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .domain([28, d3.max(csvdata, d => d.fifty_k_plus)])
        .range([0, width]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending X-Axis to Chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // Appending Y-Axis to Chart
    chartGroup.append("g")
    .attr("class", "y axis")
    .call(leftAxis);
    
    //Creating Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(csvdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.fifty_k_plus))
    .attr("cy", d => yLinearScale(d.bac_34to44))
    
    .attr("r", "15")
    .attr("fill", "orange")
    .attr("opacity", ".5");


    // Tool Tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.s_abbrev}<br>% with Bach: ${d.bac_34to44}<br>% w/income>$50k: ${d.fifty_k_plus}`);
    });

    // Create tooltup in the chart
    chartGroup.call(toolTip);

    // Creating Event Listenters for ToolTip
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })
    //Mouseout
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });

    //Create Axes Labels
    // Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("% Populatuion Making $50k+");
  
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  //.classed("axis-text", true)
  .text("% with Bachelor Degrees per State (Ages 34-44):");
});

      


   

