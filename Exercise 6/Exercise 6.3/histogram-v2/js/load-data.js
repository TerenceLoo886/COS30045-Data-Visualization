d3.csv("data/W6_TVdata.csv", d => ({
  brand: d.brand,
  model: d.model,
  screenSize: +d.screenSize,
  screenTech: d.screenTech,
  energyConsumption: +d.energyConsumption,
  star: +d.star
})).then(data => {
  console.log(data);
  drawHistogram(data);
  populateFilters(data);
  // Exercise 6.3: draw the scatterplot, then set up tooltips (built in 6.4)
  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();
}).catch(error => {
  console.error("Error loading the CSV file:", error);
});