// Exercise 6.2: keeps track of which button is selected in each filter row
let activeTech = "all";
let activeSize = "all";

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

          // Tell the histogram which filter was picked
          onSelect(d.id);
        }
      });
};

// Exercise 6.2: sets up the screen type row and the screen size row
const populateFilters = (data) => {
  buildFilter("#filters_screen", filters_screen, id => {
    activeTech = id;
    updateHistogram(data);
  });

  buildFilter("#filters_size", filters_size, id => {
    activeSize = id;
    updateHistogram(data);
  });
};

// Exercise 6.3: placeholders so load-data.js doesn't crash. Real code comes in 6.4.
const createTooltip = () => {};
const handleMouseEvents = () => {};