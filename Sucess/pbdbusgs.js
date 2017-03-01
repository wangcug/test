var map;
var wmsLayer;

var mapClickChange;

var graphicsLayer;
var graphicsLayerClick;

function initMap(){
    require(["esri/map","esri/geometry/Extent","esri/layers/WMSLayer","esri/layers/WMSLayerInfo","esri/graphic","esri/layers/GraphicsLayer"],
          function(Map,Extent,WMSLayer,WMSLayerInfo,Graphic,GraphicsLayer){

           map = new Map("map",{  
                basemap: "streets",  
                center: [-114, 44],  
                zoom: 7
               //isDoubleClickZoom:false
                //smartNavigation: false
            });  
/// pbdb information
		var timeinterval = "Permian";//geo;     //"Permian";  //In the following work, change it as a function to request from the timechart
      console.log(geo);
        var locationURL="https://paleobiodb.org/data1.2/colls/list.json?lngmin=-125&lngmax=-60&latmin=25&latmax=50&limit=all&show=time&level=3";
        locationURL += "&"+"interval="+timeinterval;
       // console.log(locationURL);
       graphicsLayer = new GraphicsLayer();
	    map.addLayer(graphicsLayer);
		graphicsLayerClick = graphicsLayer.on("click",getgeoinfoFoss);
       var result;
     //$(document).ready(function(){
        $.ajax({
         type:'get',
         url:locationURL,
         dataType:'json',
         async:true,
         success:function(data){
						result = data.records; //get the information from PBDB{"oid","typ","nco","noc","lng","lat","eag","lag","cxi","ein","lin"},
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

							 var gra= new esri.Graphic(myPoint);
							  //map.addLayer(gra);
							 graphicsLayer.add(gra);  
					}
			}
		});

        //pbdb informaiton

  

   wmsLayer = new WMSLayer("https://mrdata.usgs.gov/services/id?",{
      format:"png",
      resourceInfo:{
            copyright:"USGS",
             description:"Idaho_Lithology",
             extent:new Extent(-117.3,41.9,-111,49.1,{wkid:4326}),
             featureInfoFormat: "text/html",
             getFeatureInfo:"https://mrdata.usgs.gov/services/id?",
             getMapURL:"https://mrdata.usgs.gov/services/id?",
            layerInfos:[
              new WMSLayerInfo({
                name:"Idaho geo",
                queryable:true,
                showPopup: true
              })] ,
              spatialReferences:[3857] ,
              version:"1.3.0"   
            },
              version:"1.3.0",
              visibleLayers:["Idaho_Lithology","Idaho_Faults"],   // The overlay order:Lithology(base)->Faults(top)
              opacity:0.6
           });
           map.addLayer(wmsLayer);

        map.on("load", function(){
            map.infoWindow.resize(500,250);
          });
       
       //map.on("dbl-click",getgeoinfo);

	});
}
/*
 * 切换查询图层
 */
	function changeLayer(type){
		map.infoWindow.hide();	   	
		if(type =="USGS" ){
		  !graphicsLayerClick?"":graphicsLayerClick.remove();
		  mapClickChange = map.on("click",getgeoinfoUSGS);
	   	 }else if(type =="Foss" ){
			!mapClickChange?"":mapClickChange.remove();
	   		 graphicsLayerClick = graphicsLayer.on("click",getgeoinfoFoss);
	   	 }
    }
	 // use function to getFeatureInnfo from USGS
    function getgeoinfoFoss (event){
		 //console.log("getgeoinfoUSGS");
		// console.log(event.graphic.attributes);
		 var  attr = event.graphic.attributes;
		 var lon=event.mapPoint.x;
		 var lat=event.mapPoint.y;		
		 map.infoWindow.setTitle("Fossil Information ");
		 map.infoWindow.setContent(  "<b>Formation:</b>"+attr.Formation+"<br/><b>Collection Name:</b>"+attr.nam+"<br/><b>Early interval:</b>"+attr.oei);

		 map.infoWindow.show(event.mapPoint, map.getInfoWindowAnchor(event.screenPoint));
     };
     function getgeoinfoUSGS (event){

		 //console.log("getgeoinfoUSGS");
      var lon=event.mapPoint.x;
      var lat=event.mapPoint.y;
      var bbox = lon.toString()+","+lat.toString()+","+(lon+0.0000001).toString()+","+(lat+0.0000001).toString();
      var infoURL="https://mrdata.usgs.gov/services/id?service=WMS&request=GetFeatureInfo&VERSION=1.1.1&format=image/png&layers=Idaho_Lithology&query_layers=Idaho_Lithology&SRS=EPSG:3857&info_format=text/html&exception=text/xml&x=0&y=0&radius=0";
      infoURL += "&"+"bbox="+bbox+"&WIDTH=500&HEIGHT=250&styles=default"
 // use ajax method to get the code of html containing the geological bodies infomation, convert it to string,and extract it by Tag address
          
       $.ajax({url:infoURL,success:function(data){
            var str =  data;
            //console.log(infoURL);
            var Unitname = $(str).find('tbody>tr>td>a').html();
            var Unitage = $(str).find('tbody>tr>td:eq(1)').html();
            var primary = $(str).find('tbody>tr>td>a:eq(1)').html();
            var secondary = $(str).find('tbody>tr>td>a:last').html();
            var source = $(str).find('tbody>tr>td:last').html();
           // console.log(source);

             map.infoWindow.setTitle("Geology Information");
          map.infoWindow.setContent("<b>Unite Name:</b>"+Unitname+"<br/><b>Unite Age:</b>"+Unitage+"<br/><b>Primary Rock Type:</b>"+primary+"<br/><b>Secondary Rock Type:</b>"+secondary+"<br/><b>Source:</b>"+source) 

      map.infoWindow.setTitle("Geology Information");

      // This method uses the floating windows to query the geological information, If the USGS does not permit cross-oringn framing, it will broken down
      //map.infoWindow.setContent("<iframe  id='wmsFeatureInfo' name='wmsFeatureInfo' width='600' height='300' frameBorder='0' src='" + infoURL + "'>Cannot get WMS feature info for the clicked point.</iframe> ");
    //  console.log(infoURL);

      map.infoWindow.show(event.mapPoint, map.getInfoWindowAnchor(event.screenPoint));
    	/* var query= new esri.tasks.Query();
    	 query.returnGeometry = true;
         query.outFields =  ["*"];
         query.outSpatialReference = map.spatialReference;
         query.geometry = extent;
   	     var queryTask = new esri.tasks.queryTask(wmsLayer);
   		 queryTask.execute(query,showResults);*/
   	     //infoTemplate = new esri.infoTemplate("oid:${oid}");
     }});
}