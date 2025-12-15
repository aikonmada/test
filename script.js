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
  {
    name: 'Pos Pemadam Jakarta Pusat',
    lat: -6.1754,
    lng: 106.8272
  },
  {
    name: 'Pos Pemadam Jakarta Selatan',
    lat: -6.2146,
    lng: 106.8451
  },
  {
    name: 'Pos Pemadam Jakarta Barat',
    lat: -6.1683,
    lng: 106.7588
  }
];

// Marker pos damkar
fireStations.forEach(station => {
  L.marker([station.lat, station.lng])
    .addTo(map)
    .bindPopup(station.name);
});

let fireMarker = null;
let nearestLine = null;

// ======================
// RUMUS HAVERSINE (JARAK)
// ======================
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ======================
// KLIK PETA = KEBAKARAN
// ======================
map.on('click', function (e) {
  const fireLat = e.latlng.lat;
  const fireLng = e.latlng.lng;

  // Marker kebakaran
  if (fireMarker) map.removeLayer(fireMarker);
  if (nearestLine) map.removeLayer(nearestLine);

  fireMarker = L.marker([fireLat, fireLng], {
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/482/482216.png',
      iconSize: [32, 32]
    })
  }).addTo(map).bindPopup('Lokasi Kebakaran').openPopup();

  // Cari pos terdekat
  let nearestStation = null;
  let minDistance = Infinity;

  fireStations.forEach(station => {
    const distance = getDistance(
      fireLat,
      fireLng,
      station.lat,
      station.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  });

  // Gambar garis ke pos terdekat
  nearestLine = L.polyline([
    [fireLat, fireLng],
    [nearestStation.lat, nearestStation.lng]
  ], {
    color: 'red',
    weight: 4
  }).addTo(map);

  // Info popup
  fireMarker.bindPopup(
    `🔥 Lokasi Kebakaran<br>
     🚒 Pos Terdekat: <b>${nearestStation.name}</b><br>
     📏 Jarak: ${minDistance.toFixed(2)} km`
  ).openPopup();
});
