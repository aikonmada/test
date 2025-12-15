// Koordinat awal (Jakarta)
const map = L.map('map').setView([-6.2, 106.816666], 12);

// Tile layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Data pos pemadam kebakaran
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
  }
];

// Tampilkan marker pos pemadam
fireStations.forEach(station => {
  L.marker([station.lat, station.lng])
    .addTo(map)
    .bindPopup(station.name);
});

// Klik peta → lokasi kebakaran
let fireMarker = null;

map.on('click', function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  if (fireMarker) {
    map.removeLayer(fireMarker);
  }

  fireMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup('Lokasi Kebakaran')
    .openPopup();
});
