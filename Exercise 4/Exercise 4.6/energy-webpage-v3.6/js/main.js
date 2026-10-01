// main.js - Exercise 4.6: scales (linear for the counts, band for the brands)

// The viewBox is now 500 wide and 500 tall. In 4.5 the bars were as long as the raw counts
// (samsung is 1096), so a 500 wide svg would have cut them off. Scales fix that.
const svg = d3.select(".responsive-svg-container")
  .append("svg")
    .attr("viewBox", "0 0 500 500")
    .style("border", "1px solid black");

const drawBarChart = data => {

  // Linear scale for the counts (continuous numbers).
  // domain = the data values going in, range = the pixel values coming out.
  // 0 maps to 0 pixels and 1100 maps to 400 pixels. 1100 is just above the biggest
  // count (1096), so the longest bar nearly fills the range.
  // The range stops at 400, not 500, so the last 100 pixels are left for labels in 4.7.
  const xScale = d3.scaleLinear()
    .domain([0, 1100])
    .range([0, 400]);

  // Band scale for the brands (categories).
  // domain = one entry per brand, range = the pixel space the bars share between them.
  // D3 divides 500 pixels equally among the 25 brands and gives each one a band.
  // padding(0.1) leaves 10 percent of each band empty, which makes the gap between bars.
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, 500])
    .padding(0.1);

  svg
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", d => `bar bar-${d.count}`)
      .attr("x", 0)
      // yScale(brand) returns the top of that brand's band, so no row counter is needed
      .attr("y", d => yScale(d.brand))
      // the scale converts the count into pixels that fit inside the svg
      .attr("width", d => xScale(d.count))
      // bandwidth() is the thickness of one band after the padding is taken out
      .attr("height", yScale.bandwidth())
      .attr("fill", "blue");
};

// Load the csv, then draw the chart. The path is relative to index.html.
d3.csv("data/tvBrandCount.csv", d => {
  return {
    brand: d.brand,
    count: +d.count
  };
}).then(data => {
  console.log(data);
  console.log(d3.extent(data, d => d.count));

  // Largest first, so the band scale puts samsung at the top
  data.sort((a, b) => b.count - a.count);

  drawBarChart(data);
}).catch(error => {
  console.error("Could not load the csv. Check the file name and path.", error);
});