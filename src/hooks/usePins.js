import { useState, useCallback, useMemo } from 'react'
import Supercluster from 'supercluster'

const STORAGE_KEY = 'map-pins'

function loadPins() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function savePins(pins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins))
}

export function usePins() {
  const [pins, setPins] = useState(loadPins)

  // Initialize supercluster instance
  const cluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 60,
      maxZoom: 14,
      minPoints: 3
    })
    return sc
  }, [])

  // Add a pin
  const addPin = useCallback((latitude, longitude) => {
    const newPin = {
      id: Date.now(),
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    }
    setPins(prevPins => {
      const updated = [...prevPins, newPin]
      savePins(updated)
      return updated
    })
  }, [])

  // Delete a pin
  const deletePin = useCallback((pinId) => {
    setPins(prevPins => {
      const updated = prevPins.filter(pin => pin.id !== pinId)
      savePins(updated)
      return updated
    })
  }, [])

  // Delete all pins
  const deleteAllPins = useCallback(() => {
    savePins([])
    setPins([])
  }, [])

  // Get clustered data for current map bounds and zoom
  const getClusters = useCallback((bounds, zoom) => {
    // Update cluster with current pins
    const points = pins.map((pin, index) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [pin.longitude, pin.latitude]
      },
      properties: {
        pinId: pin.id
      }
    }))

    cluster.load(points)

    // Get clusters and points for current view
    const { _minX, _minY, _maxX, _maxY } = bounds
    const clustersAndPoints = cluster.getClusters([_minX, _minY, _maxX, _maxY], Math.floor(zoom))

    return {
      clusters: clustersAndPoints.filter(item => item.properties.cluster),
      points: clustersAndPoints.filter(item => !item.properties.cluster),
      pins: pins
    }
  }, [pins, cluster])

  // Get zoom needed to see all pins
  const getZoomForAllPins = useCallback(() => {
    if (pins.length === 0) return 15

    let minLat = pins[0].latitude
    let maxLat = pins[0].latitude
    let minLng = pins[0].longitude
    let maxLng = pins[0].longitude

    pins.forEach(pin => {
      minLat = Math.min(minLat, pin.latitude)
      maxLat = Math.max(maxLat, pin.latitude)
      minLng = Math.min(minLng, pin.longitude)
      maxLng = Math.max(maxLng, pin.longitude)
    })

    // Rough zoom calculation based on bounds
    const latDiff = maxLat - minLat
    const lngDiff = maxLng - minLng
    const maxDiff = Math.max(latDiff, lngDiff)

    if (maxDiff < 0.001) return 18
    if (maxDiff < 0.01) return 16
    if (maxDiff < 0.1) return 14
    if (maxDiff < 1) return 12
    if (maxDiff < 10) return 8
    return 4
  }, [pins])

  // Get center point for all pins
  const getCenterForAllPins = useCallback(() => {
    if (pins.length === 0) return { latitude: 0, longitude: 0 }

    const avgLat = pins.reduce((sum, pin) => sum + pin.latitude, 0) / pins.length
    const avgLng = pins.reduce((sum, pin) => sum + pin.longitude, 0) / pins.length

    return { latitude: avgLat, longitude: avgLng }
  }, [pins])

  // Export pins to text format
  const exportToPinFormat = useCallback(() => {
    return pins.map(pin => {
      const base = `${pin.latitude},${pin.longitude}`
      return pin.timestamp ? `${base},${pin.timestamp}` : base
    }).join('\n')
  }, [pins])

  // Import pins from text format (replaces existing pins)
  const importPins = useCallback((text) => {
    const lines = text.trim().split('\n').filter(line => line.trim())
    const imported = []
    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim())
      if (parts.length >= 2) {
        const lat = parseFloat(parts[0])
        const lng = parseFloat(parts[1])
        if (!isNaN(lat) && !isNaN(lng)) {
          const pin = { id: Date.now() + imported.length, latitude: lat, longitude: lng }
          if (parts[2]) pin.timestamp = parts[2]
          imported.push(pin)
        }
      }
    }
    savePins(imported)
    setPins(imported)
    return imported.length
  }, [])

  return {
    pins,
    addPin,
    deletePin,
    deleteAllPins,
    importPins,
    getClusters,
    getZoomForAllPins,
    getCenterForAllPins,
    exportToPinFormat,
    pinCount: pins.length
  }
}
