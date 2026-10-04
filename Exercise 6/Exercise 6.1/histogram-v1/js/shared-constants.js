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