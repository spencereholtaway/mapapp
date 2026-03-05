import { useEffect, useState } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const successCallback = (position) => {
    const { latitude, longitude, accuracy } = position.coords
    setLocation({ latitude, longitude, accuracy })
    setError(null)
    setPermissionDenied(false)
    setIsLoading(false)
  }

  const errorCallback = (err) => {
    let errorMessage = 'Unable to retrieve location'
    let denied = false
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location permission denied'
        denied = true
        break
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable'
        break
      case err.TIMEOUT:
        errorMessage = 'Location request timed out'
        break
    }
    setError(errorMessage)
    setPermissionDenied(denied)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })

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

  const retryLocation = () => {
    if (!navigator.geolocation) return
    setIsLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    })
  }

  return { location, error, isLoading, permissionDenied, retryLocation }
}
