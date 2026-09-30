// main.js - Exercise 4.2: using D3 to change and add elements.
// This file is loaded AFTER the D3 library, so the d3 object already exists.
// The script tags sit at the bottom of the body, so every element below is already on the page.

// ---------- Step 2: apply a style to existing HTML elements ----------

// d3.select() picks the FIRST element that matches the selector
d3.select("h1")
  .style("color", "#1b8a6b");

// Class selector: the paragraph inside the hero section
d3.select(".hero p")
  .style("font-size", "1.15rem")
  .style("color", "#0f3d3e");

// Experiment: different element, different style properties
d3.select("footer")
  .style("border-top", "4px solid #2ec4b6");

// ---------- Step 3: append elements using D3 ----------

// select() only finds the first .d3-box, so this paragraph is added to that box only
d3.select(".d3-box")
  .append("p")
  .attr("class", "d3-added")
  .text("Purchasing a low energy consumption TV will help with your energy bills!");

// selectAll() finds EVERY .d3-box, so this paragraph is added to both boxes
d3.selectAll(".d3-box")
  .append("p")
  .attr("class", "d3-added-all")
  .text("This paragraph was added to every box by selectAll().");

// ---------- Step 4: append an SVG shape using D3 ----------

const svg = d3.select(".d3-svg");

// Without attributes a rect has no size or position, so it exists in the DOM
// (check DevTools > Elements) but nothing is drawn. Attributes make it visible.
svg.append("rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 100)
  .attr("height", 30)
  .style("fill", "#2ec4b6");

// A label next to the rectangle
svg.append("text")
  .attr("x", 165)
  .attr("y", 71)
  .style("font-size", "16px")
  .style("fill", "#0f3d3e")
  .text("A rectangle drawn by D3");