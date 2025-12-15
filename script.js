// Inisialisasi peta (Jakarta)
const map = L.map('map').setView([-6.2, 106.816666], 13);

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Titik pemadam kebakaran
const fireStation = [-6.1754, 106.8272];

// Titik kebakaran
const fireLocation = [-6.2146, 106.8451];

// Marker
L.marker(fireStation).addTo(map).bindPopup('Pos Pemadam Kebakaran');
L.marker(fireLocation).addTo(map).bindPopup('Lokasi Kebakaran');

// Garis rute
L.polyline([fireStation, fireLocation], { color: 'red' }).addTo(map);
