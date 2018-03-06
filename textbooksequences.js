var globalTextSections={};
var topicModel={};
var weights=[];

function sortBorders(){
  //take in each of the cells? or clusters or cells?
  var hexes = document.getElementsByClassName("hexmap")[0].children;

  var counter=0;
  for(var i = hexes.length-6 ; i < hexes.length ; i++){
    var currObj = hexes[i];

    currObj.id = "path"+counter;
    currObj.setAttribute('style', 'stroke:'+globalColours[counter]+';');
    counter++;
  }

  assignClusterClasses();
}

function assignClusterClasses(){
  var children = document.getElementsByClassName("hexmap")[0].children;

  var counter=0;
  for(var i = 0 ; i < children.length-6 ; i++){
    var currobj = children[i];
    var objdata = currobj.__data__;
    var docID = objdata._conceptId;
    var clusterID=objdata._clusterId;

    currobj.classList.add('cluster'+clusterID);
    currobj.id = 'docID'+docID;


    var curr = children[i];

    var docID = curr.id;
    docID = docID.slice(5);

    var cluster = curr.className["baseVal"];
    cluster = cluster.slice(11);

    if(cluster=="0"){
      cluster1.push(parseInt(docID));
    }else if(cluster=="1"){
      cluster2.push(parseInt(docID));
    }else if(cluster=="2"){
      cluster3.push(parseInt(docID));
    }else if(cluster=="3"){
      cluster4.push(parseInt(docID));
    }else if(cluster=="4"){
      cluster5.push(parseInt(docID));
    }else{
      cluster6.push(parseInt(docID));
    }

  }

  prepareData();
}

function prepareData(){

  d3.json("data/java_model.json",function(error, textSections){
    if(error){
      console.log("ERROR LOADING JSON DATASET");
    }

    globalTextSections=textSections;


    d3.json("data/java_topic_model.json",function(error, topicModelData){
      if(error){
        console.log("ERROR LOADING TOPIC MODELLING DATASET");
      }

      topicModel = topicModelData;
      console.log(topicModel);

      startProcessing();

    });


  });

}


function getCluster(topicid){

  if(cluster1.indexOf(topicid)!=-1){
    return 1;
  }else if(cluster2.indexOf(topicid)!=-1){
    return 2;
  }else if(cluster3.indexOf(topicid)!=-1){
    return 3;
  }else if(cluster4.indexOf(topicid)!=-1){
    return 4;
  }else if(cluster5.indexOf(topicid)!=-1){
    return 5;
  }else{
    return 6;
  }
}

function sum(numbers) {
  return numbers.reduce(function(a,b) {
    return a + b
  });
}

// function gatherWeightInformation(b1,b2,b3){
//   var b1length = b1.length, b2length=b2.length, b3length=b3.length;
//   var topicDocDis = topicModel["topicsDocsDistrib"];
//   var totalDocs = b1length+b2length+b3length;
//
//   for(var i = 0 ; i < 25 ; i++){
//     var currTopic = topicDocDis[i];
//     var b1weight=[], b2weight=[], b3weight = [];
//     var counter=0;
//
//     while(counter<b1length){
//       var currWeight = currTopic[counter]["weight"];
//       b1weight.push(currWeight);
//
//       counter++;
//     }
//
//     while(counter<(b2length+b1length)){
//       var currWeight = currTopic[counter]["weight"];
//       b2weight.push(currWeight);
//
//       counter++;
//     }
//
//     while(counter<totalDocs){
//       var currWeight = currTopic[counter]["weight"];
//       b3weight.push(currWeight);
//
//       counter++;
//     }
//
//     var b1percent = (sum(b1weight)/68)*100;
//     var b2percent = (sum(b2weight)/68)*100;
//     var b3percent = (sum(b3weight)/68)*100;
//
//     weights.push({"book1":b1percent.toFixed(2),"book2":b2percent.toFixed(2),"book3":b3percent.toFixed(2)});
//   }
//
//   console.log(weights);
//
// }

function getWeights(b1,b2,b3){
  // console.log(b1);

  //book1 first
  var book1weights={};
  var book1Topics=[]
  for(var i = 0 ; i < b1.length ; i++){
    book1Topics.push(b1[i]["max-topic-id"]);
  }

  // console.log(book1Topics);
  //then for each topics
  for(var i = 0 ; i < 25 ; i++){

    var occ=0;

    for(var j = 0 ; j < book1Topics.length ; j++){

      var currTopic = book1Topics[j];

      if(currTopic == i){
        occ++;
      }
    }

    var weight = (occ/b1.length) * 100;
    book1weights[i] = Math.round(weight);

  }
  // console.log(book1weights);
  weights.push(book1weights);

  //book2
  var book2weights={};
  var book2Topics=[]
  for(var i = 0 ; i < b2.length ; i++){
    book2Topics.push(b2[i]["max-topic-id"]);
  }

  // console.log(book2Topics);
  //then for each topics
  for(var i = 0 ; i < 25 ; i++){

    var occ=0;

    for(var j = 0 ; j < book2Topics.length ; j++){

      var currTopic = book2Topics[j];

      if(currTopic == i){
        occ++;
      }
    }

    var weight = (occ/b2.length) * 100;
    book2weights[i] = Math.round(weight);

  }
  // console.log(book2weights);
  weights.push(book2weights);

  //book3
  var book3weights={};
  var book3Topics=[]
  for(var i = 0 ; i < b3.length ; i++){
    book3Topics.push(b3[i]["max-topic-id"]);
  }

  // console.log(book2Topics);
  //then for each topics
  for(var i = 0 ; i < 25 ; i++){

    var occ=0;

    for(var j = 0 ; j < book3Topics.length ; j++){

      var currTopic = book3Topics[j];

      if(currTopic == i){
        occ++;
      }
    }

    var weight = (occ/b3.length) * 100;
    book3weights[i] = Math.round(weight);

  }
  // console.log(book3weights);
  weights.push(book3weights);

}

function startProcessing(){
  var book1=[],book2=[],book3=[];

  for(var i = 0 ; i < globalTextSections.length ; i++){
    var current = globalTextSections[i];
    if(current["Book_ID"] == 0 ){
      book1.push(current);
    }else if(current["Book_ID"]==1){
      book2.push(current);
    }else{
      book3.push(current);
    }
  }

  getWeights(book1, book2, book3);

  // gatherWeightInformation(book1,book2,book3);

  // console.log(globalTextSections);
  //now get topic sequence in array
  var book1Seq=[],book2Seq=[],book3Seq=[];
  var counter=1;

  for(var i = 0 ; i < book1.length ; i++){
    var curr=book1[i];
    // console.log(curr);

    var occ=1;
    var topicID = curr["max-topic-id"];
    // console.log("1: "+topicID);
    var cluster = getCluster(topicID);
    //get last element of array
    // console.log(book1Seq);
    if(book1Seq.length != 0){

      //get last element
      var last = book1Seq[book1Seq.length-1];

      if(last["cluster"] == cluster){

        var topics = last["topics"];
        if(topics.indexOf(topicID)==-1){
          topics.push(topicID);

          last["topics"] = topics;
        }

        last["occ"]+=1;
      }else{
        book1Seq.push({"cluster":cluster,"topics":[topicID],"occ":1,"totalSize":book1.length});
      }

    }else{
      book1Seq.push({"cluster":cluster,"topics":[topicID],"occ":1,"totalSize":book1.length});
    }
  }

  for(var i = 0 ; i < book2.length ; i++){
    var curr=book2[i];
    // console.log(curr);

    var occ=1;
    var topicID = curr["max-topic-id"];
    // console.log("2: "+topicID);
    var cluster = getCluster(topicID);
    //get last element of array
    // console.log(book1Seq);
    if(book2Seq.length != 0){

      //get last element
      var last = book2Seq[book2Seq.length-1];

      if(last["cluster"] == cluster){

        var topics = last["topics"];
        if(topics.indexOf(topicID)==-1){
          topics.push(topicID);

          last["topics"] = topics;
        }

        last["occ"]+=1;
      }else{
        book2Seq.push({"cluster":cluster,"topics":[topicID],"occ":1,"totalSize":book2.length});
      }

    }else{
      book2Seq.push({"cluster":cluster,"topics":[topicID],"occ":1,"totalSize":book2.length});
    }
  }

  for(var i = 0 ; i < book3.length ; i++){
    var curr=book3[i];
    // console.log(curr);

    var occ=1;
    var topicID = curr["max-topic-id"];
    // console.log("3: "+topicID);
    var cluster = getCluster(topicID);
    //get last element of array
    // console.log(book1Seq);
    if(book3Seq.length != 0){

      //get last element
      var last = book3Seq[book3Seq.length-1];

      if(last["cluster"] == cluster){

        var topics = last["topics"];
        if(topics.indexOf(topicID)==-1){
          topics.push(topicID);

          last["topics"] = topics;
        }

        last["occ"]+=1;
      }else{
        book3Seq.push({"cluster":cluster,"topics":[topicID],"occ":1,"totalSize":book3.length});
      }

    }else{
      book3Seq.push({"cluster":cluster,"topics":[topicID],"occ":1,"totalSize":book3.length});
    }
  }

  bookSeq.loadAndRenderDataset({"book":"book1","data":book1Seq});
  bookSeq.loadAndRenderDataset({"book":"book2","data":book2Seq});
  bookSeq.loadAndRenderDataset({"book":"book3","data":book3Seq});

  // for(var i = 0 ; i < book1.length ; i++){
  //   var currID = book1[i]["max-topic-id"];
  //   var currText = book1[i]["max-topic"];
  //   book1Seq.push({"key":currID, "value":counter});
  //   counter++;
  // }
  //
  // counter=1;
  //
  // for(var i = 0 ; i < book2.length ; i++){
  //   var currID = book2[i]["max-topic-id"];
  //   var currText = book2[i]["max-topic"];
  //   book2Seq.push({"key":currID, "value":counter});
  //   counter++;
  // }
  //
  // counter=1;
  //
  // for(var i = 0 ; i < book3.length ; i++){
  //   var currID = book3[i]["max-topic-id"];
  //   var currText = book3[i]["max-topic"];
  //   book3Seq.push({"key":currID, "value":counter});
  //   counter++;
  // }

  // bookSeq.loadAndRenderDataset(book1Seq);
  // bookSeq.loadAndRenderDataset(book2Seq);
  // bookSeq.loadAndRenderDataset(book3Seq);
}
