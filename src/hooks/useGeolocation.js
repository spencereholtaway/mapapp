import { useEffect, useState } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsLoading(false)
      return
    }

    // Request initial location
    const successCallback = (position) => {
      const { latitude, longitude, accuracy } = position.coords
      setLocation({ latitude, longitude, accuracy })
      setError(null)
      setIsLoading(false)
    }

    const errorCallback = (err) => {
      let errorMessage = 'Unable to retrieve location'
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = 'Location permission denied'
          break
        case err.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable'
          break
        case err.TIMEOUT:
          errorMessage = 'Location request timed out'
          break
      }
      setError(errorMessage)
      setIsLoading(false)
    }

    // Get initial location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })

    // Watch position for updates (every second)
    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  return { location, error, isLoading }
}
