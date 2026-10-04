// Exercise 6.2: Keeps track of which button is selected in each filter row
let activeTech = "all";
let activeSize = "all";

// Steps 1 to 3 from the exercise: filter data, make new bins, redraw the bars
const updateHistogram = (data) => {
  // 1. Filter the data (a filter set to "all" lets everything through)
  const updatedData = data.filter(tv =>
    (activeTech === "all" || tv.screenTech === activeTech) &&
    (activeSize === "all" || tv.screenSize === +activeSize)
  );

  // 2. New bins from the filtered data (binGenerator is in shared-constants.js)
  const updatedBins = binGenerator(updatedData);

  // 3. Move the existing bars to their new heights with a transition
  d3.selectAll("#histogram rect")
    .data(updatedBins)
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y", d => yScale(d.length))
    .attr("height", d => innerHeight - yScale(d.length));
};

// Builds one row of buttons and handles the clicks
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