// Exercise 6.2: keeps track of which button is selected in each filter row
let activeTech = "all";
let activeSize = "all";

// Exercise 6.4 extension: which screen tech the scatterplot is showing
let activeScatterTech = "all";

// Exercise 6.2: filter data, make new bins, redraw the bars
const updateHistogram = (data) => {
  // 1. Filter the data (a filter set to "all" lets everything through)
  const updatedData = data.filter(tv =>
    (activeTech === "all" || tv.screenTech === activeTech) &&
    (activeSize === "all" || tv.screenSize === +activeSize)
  );

  // 2. New bins from the filtered data (binGenerator is in shared-constants.js)
  const updatedBins = binGenerator(updatedData);

  // Exercise 6.2 extension: rescale the y axis to fit the filtered bins
  if (rescaleYAxis) {
    // Math.max(1, ...) stops the scale collapsing when a filter combo has no TVs
    const newMax = Math.max(1, d3.max(updatedBins, d => d.length));
    yScale.domain([0, newMax]).nice();

    d3.select("#histogram .y-axis")
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale).tickFormat(d3.format(",")));
  }

  // 3. Move the existing bars to their new heights with a transition
  d3.selectAll("#histogram rect")
    .data(updatedBins)
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y", d => yScale(d.length))
    .attr("height", d => innerHeight - yScale(d.length));
};

// Exercise 6.4 extension: show or hide scatterplot circles based on the filter
const updateScatterplot = () => {
  const isMatch = d => activeScatterTech === "all" || d.screenTech === activeScatterTech;

  d3.selectAll("#scatterplot circle")
    // hidden circles must not react to the mouse, or they'd still trigger tooltips
    .style("pointer-events", d => isMatch(d) ? "all" : "none")
    .transition()
    .duration(500)
    .attr("opacity", d => isMatch(d) ? 0.5 : 0);
};

// Exercise 6.2: builds one row of buttons and handles the clicks
const buildFilter = (containerId, filters, onSelect) => {
  d3.select(containerId)
    .selectAll(".filter")
    .data(filters)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .text(d => d.label)
      .on("click", (e, d) => {
        // Only react if the clicked button isn't already active
        if (!d.isActive) {
          // Update the active state in the array
          filters.forEach(filter => {
            filter.isActive = d.id === filter.id;
          });

          // Update the button styles
          d3.selectAll(`${containerId} .filter`)
            .classed("active", filter => filter.id === d.id);

          // Tell the chart which filter was picked
          onSelect(d.id);
        }
      });
};

// Exercise 6.2: sets up the screen type row and the screen size row
// Exercise 6.4 extension: plus the scatterplot row
const populateFilters = (data) => {
  buildFilter("#filters_screen", filters_screen, id => {
    activeTech = id;
    updateHistogram(data);
  });

  buildFilter("#filters_size", filters_size, id => {
    activeSize = id;
    updateHistogram(data);
  });

  // Exercise 6.4 extension: scatterplot filter
  buildFilter("#filters_scatter", filters_scatter, id => {
    activeScatterTech = id;
    updateScatterplot();
  });
};

// Exercise 6.4 extension: helper that adds one centred white text line to a tooltip
const addTooltipLine = (tooltip, className, boxWidth, y, weight) => {
  tooltip
    .append("text")
    .attr("class", className)
    .text("NA")
    .attr("x", boxWidth / 2)
    .attr("y", y)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-size", "12px")
    .style("font-weight", weight);
};

// Exercise 6.4 extension: cuts long model names so they fit in the tooltip box
const shorten = (text, max) => text.length > max ? text.slice(0, max - 1) + "…" : text;

// Exercise 6.4: build the scatterplot tooltip (a hidden group with a rectangle and text)
const createTooltip = () => {
  // Append the tooltip group to the scatterplot inner chart, hidden at first
  const tooltip = innerChartS
    .append("g")
    .attr("class", "scatter-tooltip")
    .attr("transform", "translate(0, 500)")   // parked off the chart so it can't block circles
    .style("pointer-events", "none")          // the tooltip itself never steals the mouse
    .style("opacity", 0);

  // Background rectangle, same colour as the histogram bars
  tooltip
    .append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.75);

  // Exercise 6.4 extension: three lines (brand, model, screen size)
  addTooltipLine(tooltip, "tt-brand", tooltipWidth, 16, 900);
  addTooltipLine(tooltip, "tt-model", tooltipWidth, 33, 500);
  addTooltipLine(tooltip, "tt-size",  tooltipWidth, 50, 500);
};

// Exercise 6.4: show and hide the scatterplot tooltip when the mouse enters and leaves a circle
const handleMouseEvents = () => {
  innerChartS.selectAll("circle")
    .on("mouseenter", (e, d) => {
      // 1. Fill the three tooltip lines from the data bound to this circle
      d3.select(".scatter-tooltip .tt-brand").text(d.brand.toUpperCase());
      d3.select(".scatter-tooltip .tt-model").text(shorten(d.model, 26));
      d3.select(".scatter-tooltip .tt-size").text(`${d.screenSize}" ${d.screenTech}`);

      // 2. Get the circle's centre from the element that was hovered
      const cx = +e.target.getAttribute("cx");
      const cy = +e.target.getAttribute("cy");

      // 3. Position: above the circle, but kept inside the chart edges.
      //    If there is no room above, show it below the circle instead.
      const tx = Math.max(0, Math.min(innerWidth - tooltipWidth, cx - 0.5 * tooltipWidth));
      const ty = (cy - 1.5 * tooltipHeight < -margin.top) ? cy + 15 : cy - 1.5 * tooltipHeight;

      d3.select(".scatter-tooltip")
        .attr("transform", `translate(${tx}, ${ty})`)
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseleave", () => {
      // 4. Hide the tooltip and park it out of the way
      d3.select(".scatter-tooltip")
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};

// Exercise 6.4 extension: build the histogram tooltip
const createHistogramTooltip = () => {
  // The histogram inner chart is the first <g> directly inside the histogram svg
  const innerChartH = d3.select("#histogram svg > g");

  const tooltip = innerChartH
    .append("g")
    .attr("class", "hist-tooltip")
    .attr("transform", "translate(0, 500)")
    .style("pointer-events", "none")
    .style("opacity", 0);

  tooltip
    .append("rect")
    .attr("width", histTooltipWidth)
    .attr("height", histTooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", axisColor)
    .attr("fill-opacity", 0.85);

  // Two lines: energy range of the bin and how many TVs are in it
  addTooltipLine(tooltip, "tt-range", histTooltipWidth, 15, 900);
  addTooltipLine(tooltip, "tt-count", histTooltipWidth, 32, 500);
};

// Exercise 6.4 extension: show and hide the histogram tooltip over the bars
const handleHistogramMouseEvents = () => {
  d3.selectAll("#histogram rect")
    .on("mouseenter", (e, d) => {
      // d is the bin currently bound to this bar, so it stays correct after filtering
      d3.select(".hist-tooltip .tt-range")
        .text(`${d3.format(",")(d.x0)} to ${d3.format(",")(d.x1)} kWh`);
      d3.select(".hist-tooltip .tt-count")
        .text(`${d3.format(",")(d.length)} TVs`);

      // Position above the middle of the bar, kept inside the chart
      const barX = +e.target.getAttribute("x");
      const barY = +e.target.getAttribute("y");
      const barW = +e.target.getAttribute("width");

      const tx = Math.max(0, Math.min(innerWidth - histTooltipWidth, barX + barW / 2 - histTooltipWidth / 2));
      const ty = Math.max(-margin.top + 2, barY - histTooltipHeight - 5);

      d3.select(".hist-tooltip")
        .attr("transform", `translate(${tx}, ${ty})`)
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseleave", () => {
      d3.select(".hist-tooltip")
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};