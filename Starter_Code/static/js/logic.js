let myMap = L.map("map", {
  center: [0, 100],
  zoom: 2.5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link).then(function (data) {

  console.log("myData", data);

  data.features.forEach(function (feature) {
      const coordinates = feature.geometry.coordinates;
      const depth = coordinates[2];
      const magnitude = feature.properties.mag;
      const place = feature.properties.place;

      const markerColour = function (depth) {
          if (depth > 350) return "#000080";
          else if (depth > 200) return "#4682b4";
          else if (depth > 100) return "#6495ed";
          else if (depth > 50) return "#87ceeb";
          else if (depth > 0) return "#1e90ff";
          else return "#ffffff";
      };

      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
          radius: magnitude * 2,
          fillColor: markerColour(depth),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 1
      }).addTo(myMap);

      marker.bindPopup(`Location: ${place}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km<br>Lat: ${coordinates[0]}<br>Lon: ${coordinates[1]}`);
  });

  const legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'legend');

      appendLegendItem(div, "#000080", "Depth More Than 350km");
      appendLegendItem(div, "#4682b4", "Depth 200km to 350km");
      appendLegendItem(div, "#6495ed", "Depth 100km to 200km");
      appendLegendItem(div, "#87ceeb", "Depth 50km to 100km");
      appendLegendItem(div, "#1e90ff", "Depth 0km to 50km");
      appendLegendItem(div, "#ffffff", "Depth Less Than 0km");
      return div;
  };

  legend.addTo(myMap);
});

const appendLegendItem = function (parent, color, label) {
  
  const legendItem = document.createElement("div");
  legendItem.className = "legend-item";
  legendItem.style.backgroundColor = color;

  const legendLabel = document.createElement("span");
  legendLabel.textContent = label;
  legendLabel.style.color = "darkgreen"
  legendLabel.style.fontWeight = "bold"

  legendItem.appendChild(legendLabel);

  parent.appendChild(legendItem);
};
