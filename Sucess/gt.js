var width = 1366,
    height = 130;
    var geo;
 var x=d3.scale.linear().range([0,width]);
var y=d3.scale.linear().range([0,height]);


var color = d3.scale.category20();

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);
var rect = svg.selectAll("rect");
var partition = d3.layout.partition()
                  .sort(null)
                
                  .value(function(d) { return d.interval; });

d3.json("Northamerica.json", function(error, root) {
  
  var nodes = partition.nodes(root);
  var g=svg.selectAll("g")
            .data(partition.nodes(root))
             .enter().append("svg:g")
            .on("click", clicked)
            .on("dblclick",TransInterval);
  
  g.append("svg:rect")
      
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return x(d.dx); })
      .attr("height", function(d) { return y(d.dy); })
      .style("fill", function(d) {return d.colour; })
      .attr("id",function(d){return "t"+d.oid;})
    
     

  g.append("svg:text")
          /* .data(nodes.filter(function(d){
            return x(d.dx) > 6;
           }))*/
            .attr("id",function(d){return "l"+d.oid;})
            .attr("transform", transform)
            .text( function(d){return d.name; })
            .attr("dy",".35em")//function(d){ return y(d.dy);});
            .style("opacity", textDisply)
            .attr("text-anchor", "middle")
// zoom the selected ele)//ment
function clicked(d){
          x.domain([d.x, d.x + d.dx]).range([0, width]);
          y.domain([d.y, 1]).range([d.y ? 15 : 0, height]);
//var ky = (d.y? height-15:height)/(1-d.y);
//var kx=width/d.dx;

      var t=g.transition()
             .duration(150)
       // .attr("transform", function(d){ return "translate(" + x(d.x) + "," + y(d.y) + ")";});
   
     t.select("rect")
       .attr("x", function(d) { return x(d.x); })
       .attr("y", function(d) { return y(d.y); })
       .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
       .attr('height', function(d) { return y(d.y + d.dy) - y(d.y); });
     
    t.select("text")
        //.attr("x",labelX)
     //.attr("y", function(d){ return y(d.y)+18;})
     .attr("transform", transform)
      .style("opacity", textDisply)// function(d) { return x(d.dx)-8 > d3.select("#l" + d.oid).node().getComputedTextLength() ? 1 : 0; });
     .attr("text-anchor", "middle")
       d3.event.stopPropagation();
};


function transform(d) {

     return "translate(" + x(d.x +( d.dx-0) / 2) + "," + y(d.y + d.dy / 2) + ")";
  };


 function textDisply(d){
    var rectWidth = parseFloat(d3.select("#t" + d.oid).attr("width")), 
          rectX = parseFloat(d3.select("#t" + d.oid).attr("x"));
 var labelWidth;
  try {
        labelWidth = d3.select("#l" + d.oid).node().getComputedTextLength();
   } catch(err) {
        labelWidth = 25;
      } 
if (rectWidth-8 <labelWidth){
  return 0 ;
 } else{ 
return 1
}

};

//var TransInterval =  (function(d){

//return {

   // TransIl:function(d){
   // geoInter = d.name;
    // console.log(geoInter);
  //return geoInter;
 //}

//};

//}());

//console.log(geoInter);
function TransInterval(d){
  
console.log('TransInterval');
geo =d.name;
loadM(geo);
   //test(geo);
 //console.log(geo);

};
 //geo=TransInterval();

//console.log(geo);

});

//console.log(geo);

function loadM(timeinterval) {
      //var timeinterval = "Permian";//geo;     //"Permian";  //In the following work, change it as a function to request from the timechart
      //console.log(geo);
        var locationURL="https://paleobiodb.org/data1.2/colls/list.json?lngmin=-125&lngmax=-60&latmin=25&latmax=50&limit=all&show=time&level=3";
        locationURL += "&"+"interval="+timeinterval;
       // console.log(locationURL);
       //graphicsLayer = new GraphicsLayer();
      //map.addLayer(graphicsLayer);
    //graphicsLayerClick = graphicsLayer.on("click",getgeoinfoFoss);
       var result;
     //$(document).ready(function(){
        $.ajax({
         type:'get',
         url:locationURL,
         dataType:'json',
         async:true,
         success:function(data){
            result = data.records; //get the information from PBDB{"oid","typ","nco","noc","lng","lat","eag","lag","cxi","ein","lin"},
            graphicsLayer.clear();
            for(i=0; i<result.length-1;i++){
              var myPoint = {
                   "geometry":{
                      "x":result[i].lng,
                      "y":result[i].lat,
                     // "points":mypoints,
                  
                  "spatialReference":{"wkid":4326}
                  },
                  "attributes":{
                     //"XCoord":-104.4140625,
                     //"YCoord":69.2578125,
                    "Formation":result[i].sfm,
                    "nam":result[i].nam,
                    "oei":result[i].oei
                  },
                  "symbol":{
                      "color":[0,0,0,64],
                      "size":10,
              
                      "angle":0,
                      "xoffset":0,
                      "yoffset":0,
                      "type":"esriSMS",
                      "style":"esriSMSCircle",
                      "outline":{
                        "color":[0,0,0,255],
                        "width":1,
                        "type":"esriSLS",
                        "style":"esriSLSSolid"
                  }
                }
              };
              
              //graphicsLayer.remove(gra);

               var gra = new esri.Graphic(myPoint);
              // console.log(myPoint);
                //map.addLayer(gra);
                
               graphicsLayer.add(gra);  

               
          }
          console.log('done');
      }
    });


}