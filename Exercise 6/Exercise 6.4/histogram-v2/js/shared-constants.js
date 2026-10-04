// Exercise 6.1: dimensions and margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;    // total width of the chart
const height = 400;   // total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Exercise 6.3: inner chart variable for the scatterplot (assigned in scatterplot.js)
let innerChartS;

// Exercise 6.4: scatterplot tooltip size (brand, model and size lines)
const tooltipWidth = 190;
const tooltipHeight = 64;

// Exercise 6.4 extension: histogram tooltip size
const histTooltipWidth = 150;
const histTooltipHeight = 44;

// Exercise 6.1: colours accessible globally
const barColor = "#606464";
const bodyBackgroundColor = "#ffffff";   // bar gap colour, matches the white chart card
const axisColor = "#0f3d3e";             // dark green axis and label colour

// Exercise 6.1: histogram scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Exercise 6.3: scatterplot scales and colour scale
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

// Exercise 6.2 extension: set to false to keep the histogram y axis fixed after filtering
const rescaleYAxis = true;

// Exercise 6.1: bin generator. Fixed thresholds (width 200, 0 to 2800) give 14 bins
// every time, so filtering reuses the same bars.
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .domain([0, 2800])
  .thresholds(d3.range(200, 2800, 200));

// Exercise 6.2: filter options for screen type (id is what we filter the data with)
const filters_screen = [
  { id: "all",  label: "All",  isActive: true },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// Exercise 6.2 extension: filter options for the most common screen sizes
const filters_size = [
  { id: "all", label: "All Sizes", isActive: true },
  { id: "24",  label: '24"',       isActive: false },
  { id: "32",  label: '32"',       isActive: false },
  { id: "55",  label: '55"',       isActive: false },
  { id: "65",  label: '65"',       isActive: false },
  { id: "98",  label: '98"',       isActive: false }
];

// Exercise 6.4 extension: filter options for the scatterplot screen tech
const filters_scatter = [
  { id: "all",  label: "All",  isActive: true },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];