# Map Pin App

A beautiful, location-based web application built with React, Leaflet, and OpenStreetMap. Create pins on a map, manage them with an elegant interface, and export your data in a universal format.

## Features

- **🗺️ Interactive Map**: Full-screen map powered by Leaflet and OpenStreetMap tiles
- **📍 Geolocation**: Request device location and track your position (updated every second)
- **📌 Pin Management**: Click anywhere on the map to add pins, long-press to view details
- **🎯 My Location Button**: Quickly return to your current location at zoom level 15
- **📊 Pin Clustering**: Pins automatically aggregate when zoomed out for cleaner visualization
- **💾 Export Data**: Download all pins as a simple CSV file compatible with Google Maps, Apple Maps, and OpenStreetMap
- **🌓 Dark Mode**: Toggle between light and dark modes with system preference detection
- **✨ Liquid Glass Design**: Beautiful frosted glass UI with smooth animations and blur effects
- **📱 Responsive Design**: Optimized for both desktop and mobile devices
  - Desktop: Floating pin dialogs
  - Mobile: Bottom sheet dialogs

## Getting Started

### Prerequisites
- Node.js (v18+) and npm

### Installation

```bash
cd "/Volumes/SSD/ViBe CoDeZ/Maps (claude code)"
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

Output files will be in the `dist/` directory.

## Usage

1. **Request Location**: The app will request your device location on first load
2. **Add Pins**: Click anywhere on the map to add a pin
3. **View Pin Details**: Click on a pin to open its details dialog
4. **Delete Pins**: Open a pin's dialog and click the delete button
5. **Navigate**: Use pan/zoom gestures, or click "My Location" to return to your current position
6. **Zoom to All**: Click the pin count button to zoom and center on all your pins
7. **Toggle Theme**: Click the sun/moon icon to switch between light and dark modes
8. **Export Pins**: Click the download icon to export all pins as a text file

## Data Format

Pin data is exported as comma-separated values:

```
latitude,longitude
40.7128,-74.0060
51.5074,-0.1278
```

This format is compatible with:
- Google Maps (import via "Places")
- Apple Maps
- OpenStreetMap
- Spreadsheet applications

## Pin Data File Format

The exported `pins.txt` file contains one pin per line in `latitude,longitude` format. This minimalist approach ensures compatibility and allows for easy expansion later (e.g., adding names or timestamps).

## Technology Stack

- **Frontend**: React 18
- **Map**: Leaflet 4 + react-leaflet
- **Clustering**: Supercluster
- **Styling**: Tailwind CSS + Custom CSS
- **Build Tool**: Vite
- **Geolocation**: Native Geolocation API

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Planned Features

- Import pins from text files
- Named locations / pins
- Timestamps for each pin
- Pin categories/colors
- Local storage persistence

## Notes

- Location permissions are requested on app load
- Your location updates approximately every second
- Pin clustering is automatic and based on zoom level
- All data is stored locally in your browser (no server sync)
- Theme preference is saved to localStorage

## License

MIT
