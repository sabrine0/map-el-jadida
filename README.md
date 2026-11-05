# 🗺️ Map El Jadida — Interactive Roads & Intersections

An interactive **Leaflet** web map of **El Jadida's road network and intersections
(carrefours)**, driven by local GeoJSON/JSON data.

## ✨ Features
- 🛣️ Interactive map of roads and labeled intersections
- 📍 Carrefour (intersection) data from `carrefours_el_jadida*.json`
- 🧭 Multiple views, incl. labeled / exportable HTML maps
- ⚡ Zero-build — pure HTML/CSS/JS with Leaflet

## 📁 Key Files
- `index.html`, `app.js`, `style.css` — the interactive map app
- `carrefours_el_jadida*.json`, `data.json` — intersection/road data
- `el_jadida_roads_interactive.html`, `el_jadida_roads_labeled_exportable.html` — standalone map exports

## 🛠️ Tech Stack
`Leaflet` · `JavaScript` · `HTML/CSS` · `GeoJSON`

## 🚀 Run
Open `index.html` in a browser, or serve the folder:
```bash
python -m http.server 8000   # then visit http://localhost:8000
```

---
*Author: [Sabrine Essaket](https://github.com/sabrine0)*
