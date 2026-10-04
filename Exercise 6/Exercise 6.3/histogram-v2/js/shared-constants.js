const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";
const axisColor = "#5b3a29";

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Bin width 200 from 0 to 2800 gives 14 bins (thresholds are the inner edges only)
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .domain([0, 2800])
  .thresholds(d3.range(200, 2800, 200));

// Exercise 6.2: Filter options for screen type (id is what we filter the data with)
const filters_screen = [
  { id: "all",  label: "All",  isActive: true },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// Exercise 6.2:Extension: filter options for the most common screen sizes
const filters_size = [
  { id: "all", label: "All Sizes", isActive: true },
  { id: "24",  label: '24"',       isActive: false },
  { id: "32",  label: '32"',       isActive: false },
  { id: "55",  label: '55"',       isActive: false },
  { id: "65",  label: '65"',       isActive: false },
  { id: "98",  label: '98"',       isActive: false }
];
// Exercise 6.2 extension: set to false to keep the histogram y axis fixed after filtering
const rescaleYAxis = true;

// Exercise 6.3: inner chart variable for the scatterplot (assigned in scatterplot.js)
let innerChartS;

// Exercise 6.3: tooltip dimensions (used in 6.4)
const tooltipWidth = 65;
const tooltipHeight = 32;

// Exercise 6.3: scatterplot scales and colour scale
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

// Exercise 6.4 extension: filter options for the scatterplot screen tech
const filters_scatter = [
  { id: "all",  label: "All",  isActive: true },
  { id: "LED",  label: "LED",  isActive: false },
  { id: "LCD",  label: "LCD",  isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];