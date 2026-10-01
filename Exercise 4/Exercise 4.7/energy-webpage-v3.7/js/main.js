// main.js - Exercise 4.7: add labels to the bar chart

const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 500 500")
    .style("border", "1px solid black");

const drawBarChart = data => {

  // Step 1: make room for labels.
   // Left margin is now 115 units, enough for "spark electronics" (about 97 units wide).
  // The range is 340, so the longest bar ends near x = 454 and the "1096" label
  // (about 30 units wide) still fits before the right edge at 500.
  const xScale = d3.scaleLinear()
    .domain([0, 1100])
    .range([0, 340]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 500])
    .padding(0.1);

  // Step 2: one group (g) per brand, so the bar and its labels move together.
  // The group is moved down by the band scale, so everything inside it
  // is positioned relative to the top of its own band.
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // Step 3: the rectangle goes inside each group.
  // y is 0 because the group transform already placed it. If y still used
  // yScale, the bars would be shifted down twice and spread too far apart.
  barAndLabel
    .append("rect")
      .attr("class", d => `bar bar-${d.count}`)
      .attr("x", 115)
      .attr("y", 0)
      .attr("width", d => xScale(d.count))
      .attr("height", yScale.bandwidth())
      .attr("fill", "blue");

  // Step 4: brand name on the left.
  // text-anchor "end" makes the right end of the text sit at x = 105, so the names
  // are right aligned and end just before the bars.
  // dy "0.35em" nudges the text down so it is vertically centred in the band.
  barAndLabel
    .append("text")
      .text(d => d.brand)
      .attr("x", 105)
      .attr("y", yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("font-size", "13px");

  // Step 5: the exact count just after the end of each bar.
  // 115 is where the bars start, xScale(d.count) is the bar length, and 4 is a small gap.
  barAndLabel
    .append("text")
      .text(d => d.count)
      .attr("x", d => 115 + xScale(d.count) + 4)
      .attr("y", yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("font-size", "13px");
};

// Load the csv, then draw the chart. The path is relative to index.html.
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
}).then(data => {
  console.log(data);

  // Largest first, so samsung is at the top
  data.sort((a, b) => b.count - a.count);

  drawBarChart(data);
}).catch(error => {
  console.error("Could not load the csv. Check the file name and path.", error);
});