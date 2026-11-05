// Leaflet interactive + editable map (no API key). Fix polylines by dragging vertices and export JSON.

// ====== Roads dataset (rough start; refine in Edit mode) ======
const roads = [
  {
    id: "A5",
    name: "A5 — Autoroute Casablanca ↔ El Jadida ↔ Safi",
    type: "Interurban",
    category: "Autoroute",
    color: "#6b3f2a",
    traffic: "High-speed motorway; heavy intercity traffic.",
    carrefours: "Interchanges (grade-separated).",
    accidents: "TBD (cross-check accident reports).",
    connects: ["Casablanca", "El Jadida", "Safi"],
    coords: [
      [33.342, -8.354], [33.313, -8.403], [33.292, -8.447], [33.268, -8.488],
      [33.245, -8.523], [33.210, -8.575], [33.178, -8.622]
    ]
  },
  {
    id: "N1",
    name: "N1 — Route Nationale Casablanca ↔ El Jadida ↔ Safi",
    type: "Interurban",
    category: "Route Nationale",
    color: "#7b43c6",
    traffic: "Major national corridor; mixed urban fringes near El Jadida.",
    carrefours: "Multiple at-grade intersections near urban area.",
    accidents: "TBD.",
    connects: ["Casablanca", "El Jadida", "Safi"],
    coords: [
      [33.310, -8.499], [33.298, -8.505], [33.284, -8.510], [33.269, -8.513],
      [33.257, -8.518], [33.240, -8.528], [33.222, -8.545], [33.205, -8.561]
    ]
  },
  {
    id: "R301",
    name: "R301 — El Jadida ↔ Sidi Bouzid ↔ Jorf Lasfar",
    type: "Interurban (coastal)",
    category: "Route Nationale (littoral)",
    color: "#7b43c6",
    traffic: "Industrial corridor to Jorf Lasfar port; coastal access.",
    carrefours: "Several roundabouts/intersections along the coast.",
    accidents: "TBD.",
    connects: ["El Jadida", "Sidi Bouzid", "Jorf Lasfar"],
    coords: [
      [33.258, -8.508], [33.238, -8.514], [33.218, -8.535], [33.201, -8.567],
      [33.167, -8.615], [33.139, -8.650], [33.118, -8.649]
    ]
  },
  {
    id: "R316",
    name: "R316 — Vers zones industrielles (sud)",
    type: "Interurban",
    category: "Route Régionale",
    color: "#2b6cb0",
    traffic: "Regional link; moderate traffic.",
    carrefours: "Crossings with provincial P-roads.",
    accidents: "TBD.",
    connects: ["Sud El Jadida", "zones industrielles"],
    coords: [
      [33.233, -8.503], [33.204, -8.492], [33.178, -8.478], [33.151, -8.466]
    ]
  },
  {
    id: "HASSAN_II",
    name: "Avenue Hassan II — Axe nord–sud (urbain)",
    type: "Urbain (El Jadida)",
    category: "Réseau primaire urbain",
    color: "#c53030",
    traffic: "Structuring axis inside city; dense traffic.",
    carrefours: "Several major carrefours with Mohamed V, Bir Anzarane…",
    accidents: "TBD (urban).",
    connects: ["Centre-ville", "quartiers nord/sud"],
    coords: [
      [33.266, -8.499], [33.254, -8.500], [33.243, -8.503], [33.232, -8.506]
    ]
  },
  {
    id: "MOHAMED_V",
    name: "Boulevard Mohamed V / Avenue Mohamed VI — Axe est–ouest",
    type: "Urbain (El Jadida)",
    category: "Réseau principal urbain",
    color: "#dd6b20",
    traffic: "Large urban boulevard; commercial stretches.",
    carrefours: "Crosses Hassan II and Bir Anzarane.",
    accidents: "TBD.",
    connects: ["Ouest El Jadida", "Est El Jadida"],
    coords: [
      [33.254, -8.520], [33.253, -8.508], [33.253, -8.498], [33.254, -8.486]
    ]
  },
  {
    id: "BIR_ANZARANE",
    name: "Avenue Bir Anzarane",
    type: "Urbain (El Jadida)",
    category: "Collecteur urbain",
    color: "#eab308",
    traffic: "Collector avenue feeding central network.",
    carrefours: "Multiple roundabouts and signaled junctions.",
    accidents: "TBD.",
    connects: ["Centre-ville", "quartiers sud-ouest"],
    coords: [
      [33.246, -8.535], [33.247, -8.521], [33.247, -8.506], [33.245, -8.492]
    ]
  },
  {
    id: "SIDI_BOUZID",
    name: "Route de Sidi Bouzid / Avenue Errafii",
    type: "Urbain (El Jadida)",
    category: "Desserte locale / principal urbain",
    color: "#eab308",
    traffic: "Access to beach; seasonal peaks.",
    carrefours: "Roundabouts near coastal access.",
    accidents: "TBD (summer months).",
    connects: ["Centre-ville", "Sidi Bouzid"],
    coords: [
      [33.245, -8.536], [33.239, -8.540], [33.232, -8.544], [33.226, -8.548]
    ]
  },
  {
    id: "DES_FAR",
    name: "Avenue des FAR",
    type: "Urbain (El Jadida)",
    category: "Principal urbain",
    color: "#ef4444",
    traffic: "Central avenue; mixed traffic.",
    carrefours: "Intersects Hassan II and Mohamed V.",
    accidents: "TBD.",
    connects: ["Centre-ville"],
    coords: [
      [33.254, -8.512], [33.247, -8.512], [33.240, -8.512]
    ]
  }
];

// ====== Map setup ======
const map = L.map('map', { zoomControl: true }).setView([33.257, -8.505], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Draw roads
const layerGroup = L.featureGroup().addTo(map);
let activeLayer = null;

// Create polylines from dataset
const polyById = new Map();
roads.forEach(r => {
  const poly = L.polyline(r.coords, { color: r.color, weight: 5, opacity: 0.9 });
  poly.on('click', () => setActive(r, poly));
  poly.addTo(layerGroup);
  polyById.set(r.id, poly);
});

// Legend
function renderLegend() {
  const panelLegend = document.getElementById('legend');
  panelLegend.innerHTML = '';
  const cats = Array.from(new Map(roads.map(r => [r.category + '|' + r.color, r])).values());
  cats.forEach(r => {
    const el = document.createElement('div');
    el.className = 'legend-item';
    el.innerHTML = `<span class="swatch" style="background:${r.color}"></span> ${r.category}`;
    panelLegend.appendChild(el);
  });
}
renderLegend();

// Panel content
function resetPanel() {
  document.getElementById('title').textContent = 'Select a road';
  document.getElementById('info').innerHTML = `<p>Click a colored line to see details. Use <b>Edit</b> to refine geometry.</p>`;
}
resetPanel();

function setActive(road, polyline) {
  if (activeLayer) activeLayer.setStyle({ weight: 5, opacity: 0.9 });
  activeLayer = polyline;
  activeLayer.setStyle({ weight: 8, opacity: 1 });

  document.getElementById('title').textContent = road.name;
  document.getElementById('info').innerHTML = `
    <p>
      <span class="badge">${road.type}</span>
      <span class="badge">${road.category}</span>
    </p>
    <p><strong>Traffic:</strong> ${road.traffic}</p>
    <p><strong>Carrefours:</strong> ${road.carrefours}</p>
    <p><strong>Accidents:</strong> ${road.accidents}</p>
    <p><strong>Connects:</strong> ${road.connects.join(' • ')}</p>
  `;
  map.fitBounds(polyline.getBounds(), { padding: [30,30] });
}

// Fit buttons
document.getElementById('reset').addEventListener('click', () => {
  resetPanel();
  if (activeLayer) activeLayer.setStyle({ weight: 5, opacity: 0.9 });
  activeLayer = null;
  map.setView([33.257, -8.505], 13);
});

document.getElementById('fitAll').addEventListener('click', () => {
  map.fitBounds(layerGroup.getBounds(), { padding: [30,30] });
});

// ====== EDIT MODE using Leaflet.draw ======
let editOn = false;
let drawControl = null;

function enableEdit() {
  if (drawControl) return;
  drawControl = new L.Control.Draw({
    edit: {
      featureGroup: layerGroup,
      poly: { allowIntersection: false, showLength: true }
    },
    draw: false // we only edit existing roads
  });
  map.addControl(drawControl);
  editOn = true;
  document.getElementById('toggleEdit').textContent = '✏️ Edit: ON';
}

function disableEdit() {
  if (!drawControl) return;
  map.removeControl(drawControl);
  drawControl = null;
  editOn = false;
  document.getElementById('toggleEdit').textContent = '✏️ Edit: OFF';
}

document.getElementById('toggleEdit').addEventListener('click', () => {
  if (editOn) disableEdit(); else enableEdit();
});

// Keep our "roads" dataset in sync after edit
map.on(L.Draw.Event.EDITED, function (e) {
  e.layers.eachLayer(function(layer) {
    // find which road this is
    for (const [id, poly] of polyById.entries()) {
      if (poly === layer) {
        const latlngs = layer.getLatLngs().map(p => [Number(p.lat.toFixed(6)), Number(p.lng.toFixed(6))]);
        const r = roads.find(x => x.id === id);
        if (r) r.coords = latlngs;
      }
    }
  });
});

// ====== EXPORT ======
document.getElementById('exportJson').addEventListener('click', () => {
  // Export only id/name/meta + updated coords
  const exportData = roads.map(r => ({
    id: r.id, name: r.name, type: r.type, category: r.category,
    color: r.color, traffic: r.traffic, carrefours: r.carrefours,
    accidents: r.accidents, connects: r.connects, coords: r.coords
  }));
  const text = JSON.stringify(exportData, null, 2);
  const box = document.getElementById('exportBox');
  box.value = text;
  box.focus();
  box.select();
});
