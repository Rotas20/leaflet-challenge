const API_KEY ="pk.eyJ1Ijoicm90YXMyMCIsImEiOiJja2F0ejF0ZXExMWF1MndreTludnZoNXk2In0.7k11KXGrYfgFxO-I3OaPqw";


var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.feature);




    function createFeatures(earthquakeData) {

     function onEachFeature(feature, layer) {
          // layer.bindPopup("<h3>" + feature.properties.place +
          //  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" 
          //  +  "<p>" + feature.properties.depth + "</p>" 
          //  + "<p>" + feature.properties.sig + "</p>");

          for (var i = 0; i < feature.length; i++) {
              L.circle(data[i].mag, {
                fillOpacity: 0.50,
                color: "white",
                fillColor: "purple",
                radius: markerSize(data[i].mag)
              }).bindPopup("<h1>" + data[i].depth + "</h1> <hr> <h3>Significance: " + data[i].sig + "</h3>").addTo(myMap);
            }
          }
          

          // Create a GeoJSON layer containing the features array on the earthquakeData object
          // Run the onEachFeature function once for each piece of data in the array
          var earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature
          });

        

      // Sending our earthquakes layer to the createMap function
        createMap(earthquakes);
      
    }
    





  

  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

      // Define streetmap and darkmap layers
    //   var terrain_map = L.tileLayer('https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1Ijoicm90YXMyMCIsImEiOiJja2F0ejF0ZXExMWF1MndreTludnZoNXk2In0.7k11KXGrYfgFxO-I3OaPqw', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox/hillshade',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken: API_KEY,
    //     style: "mapbox://styles/rotas20/ckcnqc6a32ugv1ile5tq2eg53"
    // });
  
  
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
         "Street Map" : streetmap,
        // "Terrain Map": terrain_map
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 4,
      layers: [streetmap,earthquakes]
    });
  
 
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  
});

  