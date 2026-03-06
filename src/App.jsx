import { useState, useEffect, useRef } from 'react'
import { Map } from './components/Map'
import { PinDialog } from './components/PinDialog'
import { ControlPanel } from './components/ControlPanel'
import { useTheme } from './hooks/useTheme'
import { useGeolocation } from './hooks/useGeolocation'
import { usePins } from './hooks/usePins'
import { MapPinPlus } from 'lucide-react'

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const { location, error: locationError, isLoading: locationLoading, permissionDenied, retryLocation } = useGeolocation()
  const { pins, addPin, deletePin, deleteAllPins, importPins, getZoomForAllPins, getCenterForAllPins, exportToPinFormat, pinCount } = usePins()

  const LIGHT_STYLES = ['landscape', 'outdoor-v2', 'aquarelle', 'backdrop', 'streets-v2']
  const [lightStyleIndex, setLightStyleIndex] = useState(0)
  const handleCycleStyle = () => setLightStyleIndex(i => (i + 1) % LIGHT_STYLES.length)

  const [selectedPin, setSelectedPin] = useState(null)
  const prevMapPositionRef = useRef(null)  // position before mobile offset centering
  const shouldRestoreRef = useRef(false)
  const [mapCenter, setMapCenter] = useState(null)
  const [mapZoom, setMapZoom] = useState(15)
  const [shouldFitBounds, setShouldFitBounds] = useState(false)
  const [isFollowing, setIsFollowing] = useState(true)

  // Auto-follow: keep map centered on user location while following is active
  useEffect(() => {
    if (isFollowing && location) {
      setMapCenter([location.latitude, location.longitude])
    }
  }, [location, isFollowing])


  // Handle map click to add pins (disabled while dialog is open)
  const handleMapClick = (coords) => {
    // Don't add pins while a dialog is open on mobile
    if (selectedPin) return
    addPin(coords.latitude, coords.longitude)
  }

  // Handle pin click to show dialog
  const handlePinClick = (pin, prevPosition = null) => {
    setSelectedPin(pin)
    if (window.innerWidth < 768 && prevPosition) {
      // Save position so we can restore it when the tray is dismissed
      prevMapPositionRef.current = prevPosition
      shouldRestoreRef.current = true
    } else if (window.innerWidth >= 768) {
      setMapCenter([pin.latitude, pin.longitude])
    }
  }

  // Dismiss tray without deleting — restore the map to where it was
  const handleDialogClose = () => {
    setSelectedPin(null)
    if (shouldRestoreRef.current && prevMapPositionRef.current) {
      setMapCenter(prevMapPositionRef.current.center)
      setMapZoom(prevMapPositionRef.current.zoom)
    }
    shouldRestoreRef.current = false
    prevMapPositionRef.current = null
  }

  // Delete pin from tray — don't restore position
  const handleDialogDelete = (pinId) => {
    shouldRestoreRef.current = false
    deletePin(pinId)
    // PinDialog calls onClose() next, which calls handleDialogClose,
    // but shouldRestoreRef is already false so no restore happens
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

  // Handle "My Location" button — re-center and re-enable following
  const handleMyLocation = () => {
    if (location) {
      setIsFollowing(true)
      setMapCenter([location.latitude, location.longitude])
      setMapZoom(20)
    }
  }

  // Handle zoom in/out
  const handleZoomIn = () => setMapZoom(z => Math.min(z + 1, 22))
  const handleZoomOut = () => setMapZoom(z => Math.max(z - 1, 1))

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
    input.accept = '.txt,.csv,text/plain,text/csv'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        const count = importPins(event.target.result)
        if (count > 0) {
          setShouldFitBounds(true)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // Handle export — uses native file save dialog when available (Chrome/Edge),
  // falls back to anchor-download for Safari/Firefox
  const handleExport = async () => {
    const data = exportToPinFormat()
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'pins.txt',
          types: [{ description: 'Text file', accept: { 'text/plain': ['.txt'] } }]
        })
        const writable = await handle.createWritable()
        await writable.write(data)
        await writable.close()
        return
      } catch (err) {
        if (err.name === 'AbortError') return
        // fall through to legacy download on unexpected errors
      }
    }
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
        <div className="absolute z-40 glass px-4 py-2 rounded-lg text-sm" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', right: '16px' }}>
          Requesting location...
        </div>
      )}

      {/* Show location error */}
      {locationError && !location && !locationLoading && (
        <div className="absolute z-40 glass px-3 py-3 rounded-xl text-sm max-w-[220px]" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', right: '16px', borderColor: 'rgba(239,68,68,0.4)', borderWidth: 1 }}>
          <p className="font-semibold text-red-500 mb-1">Location unavailable</p>
          {permissionDenied ? (
            <>
              <p className="text-xs opacity-70 mb-2">
                Permission was denied. On iPhone: <strong>Settings → Privacy → Location Services → Safari</strong> and set to Allow.
              </p>
              <button
                onClick={retryLocation}
                className="text-xs underline opacity-60 hover:opacity-100"
              >
                Retry
              </button>
            </>
          ) : (
            <button
              onClick={retryLocation}
              className="text-xs underline opacity-60 hover:opacity-100"
            >
              Tap to retry
            </button>
          )}
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
        lightMapStyle={LIGHT_STYLES[lightStyleIndex]}
        shouldFitBounds={shouldFitBounds}
        onFitBoundsDone={() => setShouldFitBounds(false)}
        onDeletePin={deletePin}
        onExitFollow={() => setIsFollowing(false)}
      />

      {/* Control Panel */}
      <ControlPanel
        pinCount={pinCount}
        onMyLocation={handleMyLocation}
        isFollowing={isFollowing}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onCycleStyle={handleCycleStyle}
        onZoomToAll={handleZoomToAll}
        onExport={handleExport}
        onImport={handleImport}
        onDeleteAll={deleteAllPins}
      />

      {/* Pin Dialog */}
      {/* Pin Dialog (mobile only - desktop uses Leaflet Tooltip) */}
      <PinDialog
        pin={selectedPin}
        onDelete={handleDialogDelete}
        onClose={handleDialogClose}
      />

      {/* Drop Pin at Current Location FAB */}
      {location && !selectedPin && (
        <button
          onClick={() => addPin(location.latitude, location.longitude)}
          className="absolute left-1/2 -translate-x-1/2 z-40 btn glass !rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}
          aria-label="Drop pin at current location"
        >
          <MapPinPlus className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          Drop Pin at My Location
        </button>
      )}
    </div>
  )
}
