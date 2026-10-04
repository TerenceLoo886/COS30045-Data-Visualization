// Exercise 6.1: load the CSV, convert numbers, then draw everything
d3.csv("data/W6_TVdata.csv", d => ({
  brand: d.brand,
  model: d.model,
  screenSize: +d.screenSize,
  screenTech: d.screenTech,
  energyConsumption: +d.energyConsumption,
  star: +d.star
})).then(data => {
  console.log(data);

  // Exercise 6.1: histogram
  drawHistogram(data);

  // Exercise 6.2: filters
  populateFilters(data);

  // Exercise 6.3: scatterplot, then the scatterplot tooltip (6.4)
  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();

  // Exercise 6.4 extension: histogram tooltip
  createHistogramTooltip();
  handleHistogramMouseEvents();
}).catch(error => {
  console.error("Error loading the CSV file:", error);
});