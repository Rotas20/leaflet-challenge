const API_KEY ="pk.eyJ1Ijoicm90YXMyMCIsImEiOiJja2F0ejF0ZXExMWF1MndreTludnZoNXk2In0.7k11KXGrYfgFxO-I3OaPqw";

var basemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });



var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 4,
    });


basemap.addTo(myMap);

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryURL, function(data) {
     

  function createCircle (feature) {
    return {
      fillOpacity: 1,
      fillColor: fillColor(feature.properties.mag),
      color: "white",
      radius: RadiusSize(feature.properties.mag),
      stroke: false,
    };
  }
  
  function RadiusSize (magnitude) {
    return magnitude * 3
  }

  function fillColor (magnitude) {
    switch (true) {
      case magnitude > 9:
        return "#e31010";
      case magnitude > 6:
        return "#e83c9b";
      case magnitude > 3:
        return "#f2a863";
      case magnitude > 2:
        return "#fffd94";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#9bf2c7";
      }
  }
  


  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: createCircle,

    // note to self: change time format at some point 

    onEachFeature: function(feature,layer) {
         layer.bindPopup("Earthquake Information:" + "<hr>" + 
        "Location: " + feature.properties.place +   
        "<br>Magnitude: " + feature.properties.mag +  
        "<br>Significance: " + feature.properties.sig +
        "<br>Time: " + feature.properties.time);
    }

  }).addTo(myMap);

  // will come back to add terrain layer, plates, change time/date etc.

  var legend = L.control({
    position: "topright"
  });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var scale  = [0,1,2,3,6,9]

    var colors = [
      "#9bf2c7",
      "#d4ee00",
      "#fffd94",
      "#f2a863",
      "#e83c9b",
      "#e31010",
      "#9bf2c7"
    ];

    for (var i = 0; i < scale.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        scale[i] + (scale[i + 1] ? "&ndash;" + scale[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);


});
