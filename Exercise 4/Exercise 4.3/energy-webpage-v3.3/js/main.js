// main.js - Exercise 4.3: D3 set up.
// The 4.2 style and append code has been deleted, only the setup below remains.

// Select the container div from index.html and append an svg inside it.
// viewBox sets the internal coordinate system (width 1200, height 1600).
// The browser scales the svg to fit the container, so it stays responsive.
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black"); // border only so the canvas edges are visible

// Test rectangle with hard coded attributes.
// In the next exercises these values will come from the csv data instead.
svg
  .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 414)
    .attr("height", 16)
    .attr("fill", "blue");