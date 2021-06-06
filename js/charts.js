function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let sampleData=data.samples;
    //console.log(sampleData);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let sampleFilteredData = sampleData.filter((sampleRow) => 
    sampleRow.id === sample );
    //console.log(sampleFilteredData); 

    //  5. Create a variable that holds the first sample in the array.
    let sampleFilteredDataFirst=sampleFilteredData[0];  
    console.log(sampleFilteredDataFirst);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = sampleFilteredDataFirst.otu_ids;
    //console.log('OTU IDS: ' + otu_ids);
    let otu_labels = sampleFilteredDataFirst.otu_labels;
    //console.log('OTU LABELS: '+otu_labels);
    let sample_values = sampleFilteredDataFirst.sample_values;
    //console.log('Sample Values: ' + sample_values);


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    let SampleDataforGraph =  sampleFilteredData.sort((a,b) => a.sample_values - b.sample_values);
    console.log(SampleDataforGraph);

    
    var yticks = [];
    //(SampleDataforGraph[0].otu_ids.slice(0,10)).forEach (elem => {
    //      yticks.push('OTU ' + elem);   
    //}); 
     
    (SampleDataforGraph[0].otu_ids.slice(0,10)).map(
      elem => yticks.push('OTU ' + elem)) ;   

    
    
    var xticks = SampleDataforGraph[0].sample_values.slice(0,10);  

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: xticks.reverse(),
        y: yticks.reverse(),
        type: "bar",
        orientation: 'h',
        text: SampleDataforGraph[0].otu_labels.slice(0,10).reverse()
        //width: 1
  
  
      } 
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    //Deliverable - 2 starts here below
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: SampleDataforGraph[0].otu_ids,
      y: SampleDataforGraph[0].sample_values,
      text: SampleDataforGraph[0].otu_labels,
      mode:'markers',
      marker:{
         size: SampleDataforGraph[0].sample_values,
         color: SampleDataforGraph[0].otu_ids

      } 
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout =
    {
      title:
      {
       text: 'Bacteria Cultures Per Sample'
      },
    
     xaxis:{
        title:
           {
             text:'OTU ID'
           }
      }
    }
    ;

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 





  });

  

}
