// linechart.js - Exercise 5.2: scatter plot, line chart and area chart

const drawLineChart = data => {

  // Same idea as 5.1. The right margin is bigger to make room for the line label
  const margin = { top: 60, right: 200, bottom: 35, left: 50 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Outer svg and the inner chart group, same as 5.1
  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Both scales are linear because year and price are continuous numbers
  // d3.extent returns [smallest, largest], so the domain is [1998, 2024]
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .range([innerHeight, 0]);

  // format("d") shows ticks as whole numbers, so years read 2000 and not 2,000 or 2000.5
  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const leftAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)
      .style("font-size", "14px");

  innerChart
    .append("g")
      .call(leftAxis)
      .style("font-size", "14px");

  // y axis label in the top margin
  innerChart
    .append("text")
      .text("Average Price ($ per MWh)")
      .attr("x", -margin.left)
      .attr("y", -25)
      .attr("text-anchor", "start")
      .style("font-size", "18px");

  // Area under the line (drawn first so it sits behind the line and dots)
  const areaGenerator = d3.area()
    .x(d => xScale(d.year))
    .y0(innerHeight)                      // bottom edge of the shaded area
    .y1(d => yScale(d.averagePrice))      // top edge follows the data
    .curve(d3.curveMonotoneX);

  innerChart
    .append("path")
      .attr("d", areaGenerator(data))
      .attr("fill", "green")
      .attr("fill-opacity", 0.2);

  // Line generator turns the data into one path string for the "d" attribute
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  innerChart
    .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2);

  // Scatter plot circles, one per year
  innerChart
    .selectAll(".dot")
    .data(data)
    .join("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("fill", "green");

  // Label at the end of the line, using the last data point for its position
  const lastPoint = data[data.length - 1];

  innerChart
    .append("text")
      .text("Average Price ($ per MWh)")
      .attr("x", xScale(lastPoint.year) + 10)
      .attr("y", yScale(lastPoint.averagePrice))
      .attr("dy", "0.35em")
      .attr("fill", "green")
      .style("font-size", "14px");
};

// Load the csv. The row function finds the columns by name so a hidden
// character in the header (Excel sometimes adds one) cannot break it
d3.csv("data/ARE_Spot_Prices.csv", d => {
  const yearKey = Object.keys(d).find(k => k.includes("Year"));
  const priceKey = Object.keys(d).find(k => k.includes("Average Price"));
  return {
    year: +d[yearKey],              // + turns the text into a number
    averagePrice: +d[priceKey]
  };
}).then(data => {
  console.log(data);   // check: 27 objects with number year and averagePrice

  // Earliest year first, so the line is drawn left to right
  data.sort((a, b) => a.year - b.year);

  drawLineChart(data);
}).catch(error => {
  console.error("Could not load the price csv. Check the file name and path.", error);
});