// donutchart.js - Exercise 5.3: donut chart of TV models by screen size category

const drawDonutChart = data => {

  // No margins for a donut. The size comes from the radius instead.
  // Half of the shorter side is the biggest circle that fits, minus 20 for padding
  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;

  // Ordinal scale: maps each category name to one colour (discrete, not a position)
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Screensize_Category))
    .range(d3.schemeSet2);

  // d3.pie works out the start and end angle of every slice from the counts.
  // sort(null) keeps the slices in the same order as the csv file
  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  // Arc generator turns those angles into the path shape of a slice.
  // Inner radius 60% of the outer radius is what makes it a donut (use 0 for a pie)
  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius);

  const svg = d3.select("#donut-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  // A donut is drawn around its centre, so move (0,0) to the middle of the svg
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // One path per slice. pie(data) gives each item its angles and keeps the
  // original row in d.data, which is why the colour uses d.data.Screensize_Category
  innerChart
    .selectAll(".slice")
    .data(pie(data))
    .join("path")
      .attr("class", "slice")
      .attr("d", arcGenerator)
      .attr("fill", d => color(d.data.Screensize_Category))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

  // Labels sit at the centroid, the middle point of each slice
  innerChart
    .selectAll(".slice-label")
    .data(pie(data))
    .join("text")
      .attr("class", "slice-label")
      .text(d => d.data.Screensize_Category)
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px");
};

// Load the csv. Columns are found by name (ignoring capital letters),
// so screensize_category and Count(Brand_Reg) both work
d3.csv("data/screensizeCount.csv", d => {
  const categoryKey = Object.keys(d).find(k => k.toLowerCase().includes("category"));
  const countKey = Object.keys(d).find(k => k.toLowerCase().includes("count"));
  return {
    Screensize_Category: d[categoryKey].trim(),
    Count: +d[countKey]                 // + turns the text into a number
  };
}).then(data => {
  console.log(data);   // check: 3 objects, category as text and Count as a number

  // No sort here on purpose, so the slices keep the order of the csv
  drawDonutChart(data);
}).catch(error => {
  console.error("Could not load the size csv. Check the file name and path.", error);
});