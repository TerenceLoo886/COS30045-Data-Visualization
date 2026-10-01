// main.js - Exercise 4.5: bind data to rectangles and draw bars

// svg set up (Exercise 4.3). viewBox gives the svg its own coordinate system.
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

// Builds the chart from the loaded data. It is defined before the csv call
// so it already exists when the data arrives.
const drawBarChart = data => {
  const barHeight = 20;   // thickness of each bar
  const barSpacing = 5;   // gap between bars

  svg
    .selectAll("rect")    // no rects exist yet, so this selection is empty
    .data(data)           // attach one row of data to each future rect
    .join("rect")         // create a <rect> for every row of data
      // class hooks for styling later, e.g. "bar bar-1096"
      .attr("class", d => `bar bar-${d.count}`)
      .attr("x", 0)       // every bar starts at the left edge
      // i is the row's position, so each bar sits one step lower than the last
      .attr("y", (d, i) => i * (barHeight + barSpacing))
      .attr("width", d => d.count)  // bar length comes from the data
      .attr("height", barHeight)
      .attr("fill", "blue");
};

// Exercise 4.4: load the csv, then draw the chart.
// The path is relative to index.html.
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count   // + converts the string to a number
  };
}).then(data => {
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, d => d.count));
  console.log(d3.min(data, d => d.count));
  console.log(d3.extent(data, d => d.count));

  // Largest first, so the longest bar is at the top
  data.sort((a, b) => b.count - a.count);

  drawBarChart(data);
}).catch(error => {
  console.error("Could not load the csv. Check the file name and path.", error);
});