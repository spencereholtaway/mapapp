import { useState, useEffect } from 'react'
import { Map } from './components/Map'
import { PinDialog } from './components/PinDialog'
import { ControlPanel } from './components/ControlPanel'
import { useTheme } from './hooks/useTheme'
import { useGeolocation } from './hooks/useGeolocation'
import { usePins } from './hooks/usePins'

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const { location, error: locationError, isLoading: locationLoading } = useGeolocation()
  const { pins, addPin, deletePin, importPins, getZoomForAllPins, getCenterForAllPins, exportToPinFormat, pinCount } = usePins()

  const [selectedPin, setSelectedPin] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  const [mapZoom, setMapZoom] = useState(15)
  const [shouldFitBounds, setShouldFitBounds] = useState(false)

  // Set initial map center when location is available
  useEffect(() => {
    if (location && !mapCenter) {
      setMapCenter([location.latitude, location.longitude])
    }
  }, [location, mapCenter])


  // Handle map click to add pins (disabled while dialog is open)
  const handleMapClick = (coords) => {
    // Don't add pins while a dialog is open on mobile
    if (selectedPin) return
    addPin(coords.latitude, coords.longitude)
  }

  // Handle pin click to show dialog
  const handlePinClick = (pin) => {
    setSelectedPin(pin)
    // Center map on pin (mobile only, but we center anyway)
    setMapCenter([pin.latitude, pin.longitude])
  }

  // Handle cluster click to zoom in
  const handleClusterClick = (cluster) => {
    const expansionZoom = cluster.properties.cluster_expansion_zoom || mapZoom + 2
    setMapCenter([
      cluster.geometry.coordinates[1],
      cluster.geometry.coordinates[0]
    ])
    setMapZoom(expansionZoom)
  }

  // Handle "My Location" button
  const handleMyLocation = () => {
    if (location) {
      setMapCenter([location.latitude, location.longitude])
      setMapZoom(15)
    }
  }

  // Handle "Zoom to All Pins" button
  const handleZoomToAll = () => {
    if (pins.length === 0) {
      handleMyLocation()
      return
    }

    setShouldFitBounds(true)
  }

  // Handle theme toggle
  const handleToggleTheme = () => {
    toggleTheme()
  }

  // Handle map zoom/pan changes
  const handleMapZoomChange = (zoom, center) => {
    setMapZoom(zoom)
    if (center) {
      setMapCenter(center)
    }
  }

  // Handle import
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.csv'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        const count = importPins(event.target.result)
        if (count > 0) {
          setUploadedFileName(file.name)
          setShouldFitBounds(true)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // Handle export
  const handleExport = () => {
    const data = exportToPinFormat()
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', 'pins.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="relative w-full h-screen">
      {/* Show loading state */}
      {locationLoading && (
        <div className="absolute top-4 right-4 z-40 glass px-4 py-2 rounded-lg text-sm">
          Requesting location...
        </div>
      )}

      {/* Show location error */}
      {locationError && !location && (
        <div className="absolute top-4 right-4 z-40 glass px-4 py-2 rounded-lg text-sm text-red-500 border-red-500">
          {locationError}
        </div>
      )}

      {/* Map */}
      <Map
        location={location}
        initialZoom={15}
        pins={pins}
        onMapClick={handleMapClick}
        onPinClick={handlePinClick}
        onClusterClick={handleClusterClick}
        onMapZoomChange={handleMapZoomChange}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        isDark={isDark}
        shouldFitBounds={shouldFitBounds}
        onFitBoundsDone={() => setShouldFitBounds(false)}
      />

      {/* Control Panel */}
      <ControlPanel
        pinCount={pinCount}
        onMyLocation={handleMyLocation}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onZoomToAll={handleZoomToAll}
        onExport={handleExport}
        onImport={handleImport}
        uploadedFileName={uploadedFileName}
      />

      {/* Pin Dialog */}
      {/* Pin Dialog (mobile only - desktop uses Leaflet Tooltip) */}
      <PinDialog
        pin={selectedPin}
        onDelete={deletePin}
        onClose={() => setSelectedPin(null)}
      />
    </div>
  )
}
