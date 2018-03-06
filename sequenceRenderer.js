function sequenceRender(domElement){
  var sequenceObject={};

  sequenceObject.loadAndRenderDataset = function(d){
    sequenceData=d;
    render();
    return sequenceObject;
  }

  function render(){
    console.log(sequenceData);
    var axisV = d3.svg.axis();
    var svg = d3.select(domElement).append("svg").attr("width","1500px").attr("height","400px"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1500,
        height = 400;

    var x = d3.scaleLinear().rangeRound([0, 1500]),
      y = d3.scaleLinear().rangeRound([0, 400]);

    var g = svg.append("g")
    .attr("class","mainGroup")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(sequenceData.map(function(d) {
      return d.value;
    }));
    y.domain([0, d3.max(sequenceData, function(d) { return d.key; })]);


    var bottomAxis = d3_axis.axisBottom(x);

    // g.append("g")
    //   .attr("class", "axis axis--x")
    //   .call(d3_axis.axisBottom(x));

    // g.append("g")
    //     .attr("class", "axis axis--y")
    //     .call(d3.axisLeft(y).ticks(10, "%"))
    //   .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", "0.71em")
    //     .attr("text-anchor", "end")
    //     .text("Frequency");

    var bars = g.selectAll("rect.bar")
      .data(sequenceData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          // console.log(d.value);
          // console.log(x(d.value));
          return d.value;
        })
        .attr("y", function(d) {
          // console.log(d.key);
          return y(d.key);
        })
        .attr("width", function(d){

          return 1;
        })
        .attr("height", function(d) {
          // console.log(height);
          return height - y(d.key);
        })
        .style("fill",function(d){
          var currid = d.key;

          if(cluster1.indexOf(currid) != -1){
            return globalColours[0];
          }else if(cluster2.indexOf(currid) != -1){
            return globalColours[1];
          }else if(cluster3.indexOf(currid) != -1){
            return globalColours[2];
          }else if(cluster4.indexOf(currid) != -1){
            return globalColours[3];
          }else if(cluster5.indexOf(currid) != -1){
            return globalColours[4];
          }else{
            return globalColours[5];
          }
        });
  }

  return sequenceObject;
}
