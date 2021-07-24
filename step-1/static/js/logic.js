// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place, time and magnitude of the earthquake
  // Include popups that provide additional information about the earthquake when a marker is clicked.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Place: " + feature.properties.place +
      "</h3><hr><p> Time: " + new Date(feature.properties.time) + "</p>" + "</h3> Magnitude: " + feature.properties.mag + "</h3>");
  }

  // create data markers to reflect the magnitude of the earthquake by their size and and depth of the earth quake by color.
   // "properties.mag" from json data gives the magnitude. HINT the depth of the earth can be found as the third coordinate for each earthquake.
  // CircleMarker
  
  function createCircleMarker(feature, latlng){
    let options = {
        radius: feature.properties.mag*8,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
                
    }
    return L.circleMarker(latlng, options);
}
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature, 
    pointToLayer: createCircleMarker
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.
// Function that will determine the color of the marker based on earthquake magnitude
function chooseColor(mag) {
  switch(true) {
    case(0 <= mag && mag <= 1):
      return "#7CFC00"; 
    case(1 <= mag && mag <= 2):
      return "#9ACD32"; 
    case(2 <= mag && mag <= 3):
      return "#FFD700";
    case(3 <= mag && mag <= 4):
      return "#FFA500"; 
    case(4 <= mag && mag <= 5):
      return "#FF6347"
    case(5 <= mag):
      return "#DC143C";
  }
}

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [0, 1, 2, 3, 4, 5];
  var colors = ["#7CFC00",  "#9ACD32", "#FFD700", "#FFA500", "#FF6347", "#DC143C"];
  //labels = []

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
};

function createMap(earthquakes) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  //var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    //maxZoom: 18,
    //id: "dark-v10",
    //accessToken: API_KEY
  //});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
    //"Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}
