import { useEffect, useState, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LocationMarker = ({ location, isDark }) => {
  const icon = useMemo(() => {
    const c = isDark ? 'white' : 'black'
    return L.icon({
      iconUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='2.5' fill='${c}'/><circle cx='12' cy='12' r='6' stroke='${c}' stroke-width='1.5'/><line x1='12' y1='1' x2='12' y2='4' stroke='${c}' stroke-width='1.5' stroke-linecap='round'/><line x1='12' y1='20' x2='12' y2='23' stroke='${c}' stroke-width='1.5' stroke-linecap='round'/><line x1='1' y1='12' x2='4' y2='12' stroke='${c}' stroke-width='1.5' stroke-linecap='round'/><line x1='20' y1='12' x2='23' y2='12' stroke='${c}' stroke-width='1.5' stroke-linecap='round'/></svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }, [isDark])

  if (!location) return null

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icon}
      pane="shadowPane"
    >
      <Popup>Your current location</Popup>
    </Marker>
  )
}

const pinIcon = L.divIcon({
  html: '<div class="pin-pulse"><div class="pin-dot"></div><div class="pin-ring"></div></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: 'pin-marker-icon'
})

const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount()
  return L.divIcon({
    html: `<div class="cluster-pulse"><div class="cluster-dot" style="font-family: Inter, system-ui, -apple-system, sans-serif;">${count}</div><div class="cluster-ring"></div></div>`,
    iconSize: [40, 40],
    className: ''
  })
}

export function Map({
  location,
  initialZoom = 15,
  pins,
  onMapClick,
  onPinClick,
  onClusterClick,
  mapCenter,
  mapZoom,
  isDark = false,
  onMapZoomChange,
  shouldFitBounds = false,
  onFitBoundsDone = () => {},
  onDeletePin
}) {
  const mapRef = useRef(null)

  // Tile layer URLs
  // Light: hardcode @2x so 512px tiles render at 256px CSS = perfect 1:1 on 2x retina
  const MAPTILER_KEY = '4VoqoKK7G2HVhGvf8EsC'
  const lightTileUrl = `https://api.maptiler.com/maps/landscape/{z}/{x}/{y}@2x.png?key=${MAPTILER_KEY}`
  const darkTileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  const tileUrl = isDark ? darkTileUrl : lightTileUrl

  return (
    <MapContainer
      center={mapCenter || [51.505, -0.09]}
      zoom={mapZoom || initialZoom}
      style={{ width: '100%', height: '100%' }}
      ref={mapRef}
      zoomControl={false}
      key={isDark ? 'dark' : 'light'}
      attributionControl={true}
      maxZoom={22}
    >
      <TileLayer
        attribution={isDark ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' : '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
        url={tileUrl}
        tileSize={256}
        detectRetina={isDark}
        maxZoom={isDark ? 19 : 22}
      />

      {/* Map updater for center/zoom and zoom change listener */}
      <MapUpdater mapCenter={mapCenter} mapZoom={mapZoom} onMapZoomChange={onMapZoomChange} />

      {/* Fit bounds to all pins when needed */}
      <MapBoundsFitter pins={pins} shouldFitBounds={shouldFitBounds} onFitBoundsDone={onFitBoundsDone} />

      {/* Clustered pin markers */}
      <PinMarkers pins={pins} onPinClick={onPinClick} onDeletePin={onDeletePin} />

      {/* Location marker - rendered last so it appears underneath */}
      <LocationMarker location={location} isDark={isDark} />

      {/* Click handler for map */}
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  )
}

function MapClickHandler({ onMapClick }) {
  const map = useMap()

  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng
      onMapClick({ latitude: lat, longitude: lng })
    }

    map.on('click', handleClick)
    return () => map.off('click', handleClick)
  }, [map, onMapClick])

  return null
}

function MapUpdater({ mapCenter, mapZoom, onMapZoomChange }) {
  const map = useMap()

  useEffect(() => {
    if (mapCenter && mapZoom) {
      map.setView([mapCenter[0], mapCenter[1]], mapZoom, { animate: true })
    }
  }, [map, mapCenter, mapZoom])

  useEffect(() => {
    const handleZoomChange = () => {
      const currentZoom = map.getZoom()
      if (onMapZoomChange) {
        onMapZoomChange(currentZoom)
      }
    }

    const handleMoveEnd = () => {
      const currentZoom = map.getZoom()
      const center = map.getCenter()
      if (onMapZoomChange) {
        onMapZoomChange(currentZoom, [center.lat, center.lng])
      }
    }

    map.on('zoomend', handleZoomChange)
    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('zoomend', handleZoomChange)
      map.off('moveend', handleMoveEnd)
    }
  }, [map, onMapZoomChange])

  return null
}

function PinMarkers({ pins, onPinClick, onDeletePin }) {
  const map = useMap()

  const handlePinClick = (pin) => {
    onPinClick(pin)

    // On mobile, offset the center so the pin appears in the visible area above the bottom sheet
    if (window.innerWidth < 768) {
      const containerHeight = map.getContainer().offsetHeight
      const pinPoint = map.latLngToContainerPoint([pin.latitude, pin.longitude])
      // Shift pin up by ~25% of container height to center it in the visible area above the sheet
      const offset = containerHeight * 0.25
      const adjustedPoint = L.point(pinPoint.x, pinPoint.y + offset)
      const newCenter = map.containerPointToLatLng(adjustedPoint)
      map.setView(newCenter, map.getZoom(), { animate: true })
    } else {
      map.setView([pin.latitude, pin.longitude], map.getZoom(), { animate: true })
    }
  }

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      disableClusteringAtZoom={18}
      showCoverageOnHover={false}
      iconCreateFunction={createClusterIcon}
    >
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.latitude, pin.longitude]}
          icon={pinIcon}
          eventHandlers={{
            click: () => handlePinClick(pin)
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -12]}
            className="pin-tooltip"
            opacity={1}
            interactive={true}
          >
            <div className="pin-tooltip-content">
              <div className="pin-tooltip-header">
                <span className="pin-tooltip-icon">📍</span>
                <strong>Saved Pin</strong>
              </div>
              <div className="pin-tooltip-coords">
                <div><span className="pin-tooltip-label">Lat</span> {pin.latitude.toFixed(6)}</div>
                <div><span className="pin-tooltip-label">Lng</span> {pin.longitude.toFixed(6)}</div>
              </div>
              <button className="pin-tooltip-delete" onClick={(e) => { e.stopPropagation(); onDeletePin(pin.id); }}>
                🗑️ Delete
              </button>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MarkerClusterGroup>
  )
}

function MapBoundsFitter({ pins, shouldFitBounds, onFitBoundsDone }) {
  const map = useMap()

  useEffect(() => {
    if (shouldFitBounds && pins.length > 0) {
      // Calculate bounds from all pins
      const bounds = L.latLngBounds(
        pins.map(pin => [pin.latitude, pin.longitude])
      )

      // Fit map to bounds with padding
      map.fitBounds(bounds, { padding: [50, 50] })

      // Notify parent that fit bounds is complete
      onFitBoundsDone()
    }
  }, [map, pins, shouldFitBounds, onFitBoundsDone])

  return null
}
