let map = L.map("rain-map");
let baseLayer = null;
let rainLayer = null;

async function getRainMap(forecastData) {
  map.setView([forecastData.latitude, forecastData.longitude], 10);
  // A base map to provide context. OpenStreetMap is a common choice

  // Remove previous layers if they exist
  if (baseLayer) map.removeLayer(baseLayer);
  if (rainLayer) map.removeLayer(rainLayer);

  // Add a new base layer
  baseLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  // Add a new rain layer
  const rainTile = await getTileURL();
  rainLayer = L.tileLayer(rainTile, {
    attribution: "RainViewer",
    opacity: 0.3, // Adjust opacity as needed
    zIndex: 3, // Ensure it's above the base map
  }).addTo(map);
}

async function getTileURL() {
  const resp = await fetch(
    "https://api.rainviewer.com/public/weather-maps.json"
  );
  const data = await resp.json();
  const path = data.radar.nowcast[0].path;

  return `https://tilecache.rainviewer.com${path}/512/{z}/{x}/{y}/2/1_0.png`;
}

export { getRainMap };
