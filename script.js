// ======================
// CONFIG
// ======================
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNlZWMyZTNjODlkYzRlODJhY2YyNDg4NTExZWM5MDJjIiwiaCI6Im11cm11cjY0In0=";

// ======================
// INIT MAP
// ======================
const map = L.map('map').setView([-6.2, 106.816666], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// ======================
// DATA POS PEMADAM
// ======================
const fireStations = [
  { name: 'Pos Pemadam Jakarta Pusat', lat: -6.1754, lng: 106.8272 },
  { name: 'Pos Pemadam Jakarta Selatan', lat: -6.2146, lng: 106.8451 },
  { name: 'Pos Pemadam Jakarta Barat', lat: -6.1683, lng: 106.7588 }
];

// Marker pos damkar
fireStations.forEach(s => {
  L.marker([s.lat, s.lng]).addTo(map).bindPopup(s.name);
});

let fireMarker = null;
let routeLine = null;

// ======================
// HITUNG JARAK (HAVERSINE)
// ======================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ======================
// AMBIL ROUTE DARI ORS
// ======================
async function getRoute(start, end) {
  const response = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      method: "POST",
      headers: {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat]
        ]
      })
    }
  );

  return response.json();
}

// ======================
// KLIK PETA = KEBAKARAN
// ======================
map.on('click', async function (e) {
  const fire = { lat: e.latlng.lat, lng: e.latlng.lng };

  if (fireMarker) map.removeLayer(fireMarker);
  if (routeLine) map.removeLayer(routeLine);

  fireMarker = L.marker([fire.lat, fire.lng]).addTo(map)
    .bindPopup("🔥 Lokasi Kebakaran")
    .openPopup();

  // Cari pos terdekat
  let nearest = null;
  let minDist = Infinity;

  fireStations.forEach(s => {
    const d = getDistance(fire.lat, fire.lng, s.lat, s.lng);
    if (d < minDist) {
      minDist = d;
      nearest = s;
    }
  });

  // Ambil routing jalan asli
  const routeData = await getRoute(nearest, fire);

  const coords = routeData.features[0].geometry.coordinates;
  const latlngs = coords.map(c => [c[1], c[0]]);

  routeLine = L.polyline(latlngs, {
    color: 'red',
    weight: 5
  }).addTo(map);

  const summary = routeData.features[0].properties.summary;

  fireMarker.bindPopup(
    `🔥 Lokasi Kebakaran<br>
     🚒 Pos Terdekat: <b>${nearest.name}</b><br>
     📏 Jarak Jalan: ${(summary.distance / 1000).toFixed(2)} km<br>
     ⏱️ Waktu Tempuh: ${(summary.duration / 60).toFixed(1)} menit`
  ).openPopup();
});
