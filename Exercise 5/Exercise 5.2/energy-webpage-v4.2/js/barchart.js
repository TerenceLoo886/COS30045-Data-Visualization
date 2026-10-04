// barChart.js - Exercise 5.1: vertical bar chart with axes and labels

const drawVerticalBarChart = data => {

  // Margins leave room for the axis and axis label around the inner chart
  const margin = { top: 60, right: 30, bottom: 35, left: 50 };
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Main svg container. The viewBox makes it scale with the page
  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // Inner chart group, moved right and down by the margins so (0,0) is the
  // top left corner of the actual chart area
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // x is a band scale because screen type is a category
  // y is a linear scale because energy is a number
  // y range is flipped [innerHeight, 0] because svg y grows downwards
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Screen_Tech))
    .range([0, innerWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Energy_Consumption)])
    .range([innerHeight, 0]);

  // Axis generators. tickSize(0) removes the little tick marks on the x axis
  const bottomAxis = d3.axisBottom(xScale).tickSize(0);
  const leftAxis = d3.axisLeft(yScale);

  // x axis is pushed down to the bottom of the inner chart
  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis)
      .selectAll("text")
        .style("font-size", "16px")
        .attr("dy", "1.2em");

  // y axis stays at (0,0) so it needs no transform
  innerChart
    .append("g")
      .call(leftAxis);

  // y axis label, placed above the axis in the top margin
  innerChart
    .append("text")
      .text("Energy Consumption (kWh)")
      .attr("x", -margin.left)
      .attr("y", -35)
      .attr("text-anchor", "start")
      .style("font-size", "18px");

  // Bars. Height = innerHeight minus yScale(value) because of the flipped y scale
  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.Screen_Tech))
      .attr("y", d => yScale(d.Energy_Consumption))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.Energy_Consumption))
      .attr("fill", "green");

  // Value labels sitting just above each bar, centred on the bar
  innerChart
    .selectAll(".bar-label")
    .data(data)
    .join("text")
      .attr("class", "bar-label")
      .text(d => `${Math.round(d.Energy_Consumption)} kWh`)
      .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.Energy_Consumption) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "14px");
};

// Tidy up the raw names. The KNIME data calls LED TVs "lcd led"
const niceNames = { "lcd": "LCD", "lcd led": "LED", "led": "LED", "oled": "OLED" };

// Load the csv, then draw the chart. The path is relative to index.html
d3.csv("data/screenTechEnergy55.csv", d => {
  // Use the tidy header if present, otherwise the long KNIME header
  const energy = d.Energy_Consumption ?? d["Mean(Labelled energy consumption (kWh/year))"];
  const tech = d.Screen_Tech.trim().toLowerCase();
  return {
    Screen_Tech: niceNames[tech] ?? tech.toUpperCase(),
    Energy_Consumption: +energy
  };
}).then(data => {
  console.log(data);   // check: text for Screen_Tech, numbers for Energy_Consumption

  // Highest first, so the order is LED, OLED, LCD
  data.sort((a, b) => b.Energy_Consumption - a.Energy_Consumption);

    drawVerticalBarChart(data);
}).catch(error => {
  console.error("Could not load the csv. Check the file name and path.", error);
});