import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LocationMarker = ({ location }) => {
  const map = useMap()

  useEffect(() => {
    if (location) {
      // Don't auto-center, but update marker position
    }
  }, [location, map])

  if (!location) return null

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2322c55e"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10" fill="none" stroke="%2322c55e" stroke-width="2" opacity="0.5"/></svg>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
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
  const lightTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
    >
      <TileLayer
        attribution={isDark ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
        url={tileUrl}
      />

      {/* Map updater for center/zoom and zoom change listener */}
      <MapUpdater mapCenter={mapCenter} mapZoom={mapZoom} onMapZoomChange={onMapZoomChange} />

      {/* Fit bounds to all pins when needed */}
      <MapBoundsFitter pins={pins} shouldFitBounds={shouldFitBounds} onFitBoundsDone={onFitBoundsDone} />

      {/* Clustered pin markers */}
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
              click: () => onPinClick(pin)
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

      {/* Location marker - rendered last so it appears underneath */}
      <LocationMarker location={location} />

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
