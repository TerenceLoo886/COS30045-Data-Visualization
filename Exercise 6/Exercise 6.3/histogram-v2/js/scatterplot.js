// Exercise 6.3: scatterplot of star rating vs energy consumption
const drawScatterplot = (data) => {
  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  // innerChartS is declared in shared-constants.js, so no const here
  innerChartS = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales: star rating on x, energy consumption on y
  const maxStar = d3.max(data, d => d.star);
  const maxEnergy = d3.max(data, d => d.energyConsumption);

  xScaleS.domain([0, maxStar]).range([0, innerWidth]);
  yScaleS.domain([0, maxEnergy]).range([innerHeight, 0]).nice();

  // Colour scale: one hue per screen type (hue = category, not magnitude)
  colorScale
    .domain(data.map(d => d.screenTech))   // unique screenTech values
    .range(d3.schemeCategory10);

  // Circles: semi-transparent so overlapping points are visible, no stroke
  innerChartS.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5);

  // Axes
  innerChartS.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScaleS));

  innerChartS.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScaleS).tickFormat(d3.format(",")));

  svg.selectAll(".x-axis, .y-axis").attr("color", axisColor);

  // Axis labels
  svg.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .attr("fill", axisColor)
    .style("font-size", "14px")
    .text("Labeled Energy Consumption (kWh/year)");

  svg.append("text")
    .attr("x", width - margin.right)
    .attr("y", height - 8)
    .attr("text-anchor", "end")
    .attr("fill", axisColor)
    .style("font-size", "14px")
    .text("Star Rating");

  // Legend in the top right corner of the svg
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 100}, ${margin.top})`);

  // One legend row per screen type
  colorScale.domain().forEach((screenTech, i) => {
    const legendRow = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);   // space rows 20px apart

    legendRow.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", colorScale(screenTech));

    legendRow.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("alignment-baseline", "middle")
      .attr("fill", axisColor)
      .text(screenTech);
  });
};