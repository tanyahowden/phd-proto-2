function verticalRenderer(domElement){
  var verticalObject={}

  verticalObject.loadAndRenderDataset = function(d){
    sequenceData = d;
    render();
    return verticalObject;
  }

  function render(){
    // console.log(sequenceData);
    var totalHeight=[];

    var bookname = sequenceData["book"],
        renderData = sequenceData["data"];

    var svg = d3.selectAll(domElement)
      .append("svg")
      .attr("width","200")
      .attr("height","800")
      .attr("class","svg")
      .attr("id",bookname);

    svg.append("text")
      .style("fill","black")
      .attr("text-anchor","middle")
      .style("font-size","20px")
      .attr("transform","translate(95,15)")
      .text(function(d){

        if(bookname=="book1"){
          return "Guide to Wireframing";
        }else if(bookname=="book2"){
          return "Guide to Mockups";
        }else{
          return "UX Design Process";
        }

      })
      .on("click",function(d){
        var book = d3.select(this);
        var booktxt = book[0][0]["textContent"];

        if(booktxt == "Guide to Wireframing"){
          window.open("http://www.uxpin.com/studio/ebooks/guide-to-wireframing/","_blank");
        }else if(booktxt == "Guide to Mockups"){
          window.open("http://www.uxpin.com/studio/ebooks/guide-to-mockups/","_blank");
        }else{
          window.open('http://www.uxpin.com/studio/ebooks/guide-to-ux-design-process-and-documentation/', '_blank')
        }
      });

    var g = svg.append("g")
    .attr("class","mainGroup")
    .attr("transform", "translate(" + 45 + "," + 30 + ")");

    var tip = d3.tip()
              .attr("class","d3-tip")
              .offset([0,0]);
    svg.call(tip);

    var bars = g.selectAll("rect.bars")
      .data(renderData)
      .enter()
      .append("rect")
      .attr("class","bars")
      .attr("width",function(d){
        return 100;
      })
      .attr("height",function(d){
        //25 for ux, 30 for java
        var height = d["occ"]*25;
        totalHeight.push(height);
        return height;
      })
      .attr("y",function(d,i){
        var total=0;
        for(var j = 0 ; j < i ; j++){
          total+=totalHeight[j];
        }
        return total;
      })
      .attr("fill",function(d){
        var cluster=d["cluster"];

        if(cluster==1){
          return globalColours[0];
        }else if(cluster==2){
          return globalColours[1];
        }else if(cluster==3){
          return globalColours[2];
        }else if(cluster==4){
          return globalColours[3];
        }else if(cluster==5){
          return globalColours[4];
        }else{
          return globalColours[5];
        }
      })
      .on("mouseover",function(d){
        // console.log(d);
        var topics=d["topics"];
        var cluster=d["cluster"]-1;

        d3.selectAll("rect.bars")
          .style("opacity",0.4);

        d3.select(this)
          .style("opacity",1);

        d3.selectAll(".hex")
          .style("opacity",0.3);

        d3.selectAll(".border")
          .style("opacity",0.3);

        d3.select("#path"+cluster)
          .style("opacity",1);

        for(var i = 0 ; i < topics.length ; i++){
          var currTopic = topics[i];

          d3.select("#docID"+currTopic)
            .style("opacity",1);
        }

        console.log(d);
        var bookPercent = (d["occ"]/d["totalSize"]) * 100
        // console.log(Math.round(bookPercent));
        var btxt = Math.round(bookPercent) + "% of text";

        tip
          .html(function(){
            return btxt;
          })

        //Show the tooltips on hover
        tip.show();

      })
      .on("mouseout",function(d){
        d3.selectAll("rect.bars")
          .style("opacity",1);

        d3.selectAll(".hex")
          .style("opacity",1);

        d3.selectAll(".border")
          .style("opacity",1);

        tip.hide();
      });



    var hexes = d3.selectAll(".hex")
      .on("mouseover",function(d){
        // console.log(d)
        var topicID = parseInt(d["conceptId"]);

        d3.selectAll(".hex")
          .style("opacity",0.3);

        d3.select(this)
          .style("opacity",1);

        d3.selectAll(".border")
          .style("opacity",0.3);

        d3.select("#path"+d["clusterId"])
          .style("opacity",1);

        d3.selectAll("rect.bars")
          .style("opacity",function(d){
            var topics=d["topics"];
            if(topics.indexOf(topicID)==-1){
              return "0.3";
            }else{
              return "1";
            }
          });

        var btxt = "Wireframing Guide: " + weights[0][topicID] + "% </br> Guide to Mockups: "+weights[1][topicID]+"% </br> UX Guide: "+weights[2][topicID]+"%";

        tip
          .html(function(){
            return btxt;
          })

        //Show the tooltips on hover
        tip.show();

      })
      .on("mouseout",function(d){
        d3.selectAll(".hex")
          .style("opacity",1);

        d3.selectAll(".border")
          .style("opacity",1);

        d3.selectAll("rect.bars")
          .style("opacity",1);

        tip.hide();
      });
  }

  return verticalObject;
}
