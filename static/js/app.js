function buildMetadata(sample) {
  console.log("Build metadata"); 

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {

    var sampleData = d3.select("#sample-metadata");
    
    sampleData.html("");

    Object.entries(response).forEach(([key, value]) => {
      var graf = sampleData.append("p");
      graf.text(`${key}: ${value}`);
    })

    console.log(response.WFREQ);
    buildGauge(response.WFREQ);

  })

};

function buildCharts(sample) {
  console.log("Build new chart");

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

  d3.json(url).then(function(data) {

    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    };

    var bubbleData = [trace1];

    var layout = {
      title: 'OTU IDs',
      showlegend: false,
    };

    Plotly.newPlot('bubble', bubbleData, layout);

  

    // @TODO: Build a Bubble Chart using the sample data

    var pieValue = data.sample_values.slice(0,10);
    var pieLabels = data.otu_ids.slice(0,10);
    var pieHover = data.otu_labels.slice(0,10);

    var trace2 = {
      values: pieValue,
      labels: pieLabels,
      hovertext: pieHover,
      type: 'pie'
    };

    var pieData = [trace2];

    var pieLayout = {
      showlegend: true
    };

    Plotly.newPlot('pie', pieData, pieLayout);

  });

  

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
console.log("Launching app.")
init();
