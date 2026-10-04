const drawHistogram = (data) => {
  const svg = d3.select("#histogram")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const bins = binGenerator(data);

  const minEng = bins[0].x0;
  const maxEng = bins[bins.length - 1].x1;
  const binsMaxLength = d3.max(bins, d => d.length);

  xScale.domain([minEng, maxEng]).range([0, innerWidth]);
  yScale.domain([0, binsMaxLength]).range([innerHeight, 0]).nice();

  // Bars
  innerChart.selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", d => xScale(d.x0))
    .attr("y", d => yScale(d.length))
    .attr("width", d => xScale(d.x1) - xScale(d.x0))
    .attr("height", d => innerHeight - yScale(d.length))
    .attr("fill", barColor)
    .attr("stroke", bodyBackgroundColor)
    .attr("stroke-width", 2);

  // X axis (comma-formatted ticks, e.g. 1,000)
  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.format(","));
  innerChart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(bottomAxis);

  // Y axis
  const leftAxis = d3.axisLeft(yScale).tickFormat(d3.format(","));
  innerChart.append("g")
    .attr("class", "y-axis")
    .call(leftAxis);

  // Axis colours to match the brown theme
  svg.selectAll(".x-axis, .y-axis").attr("color", axisColor);

  // Axis labels
  svg.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .attr("fill", axisColor)
    .style("font-size", "14px")
    .text("Frequency");

  svg.append("text")
    .attr("x", width - margin.right)
    .attr("y", height - 8)
    .attr("text-anchor", "end")
    .attr("fill", axisColor)
    .style("font-size", "14px")
    .text("Labeled Energy Consumption (kWh/year)");
};