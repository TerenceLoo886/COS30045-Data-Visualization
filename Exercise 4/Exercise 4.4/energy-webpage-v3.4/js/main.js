// main.js - Exercise 4.3 and 4.4

// ---------- Exercise 4.3: svg set up ----------
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");

svg
  .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");

// ---------- Exercise 4.4: load data from csv ----------

// The path is relative to index.html, not to this file.
// The function runs once per row and returns the object for that row.
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,   // text stays as text
    count: +d.count   // the + turns the string "1096" into the number 1096
  };
}).then(data => {
  // Step 2: check the array in the console
  console.log(data);

  // Step 3: basic facts about the data
  console.log(data.length);                   // number of rows
  console.log(d3.max(data, d => d.count));    // largest count
  console.log(d3.min(data, d => d.count));    // smallest count
  console.log(d3.extent(data, d => d.count)); // [min, max] together

  // Sort from largest to smallest (use a.count - b.count for smallest first)
  data.sort((a, b) => b.count - a.count);
  console.log(data);

  // Hand the data to the function that draws the chart (built in 4.5)
  drawBarChart(data);
}).catch(error => {
  console.error("Could not load the csv. Check the file name and path.", error);
});

// Empty for now so the call above doesn't cause an error. 4.5 fills it in.
function drawBarChart(data) {
}