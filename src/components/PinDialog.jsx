import { MapPin, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PinDialog({ pin, onDelete, onClose }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop uses Leaflet's built-in Tooltip (handled in Map.jsx)
  // Only show bottom sheet on mobile
  if (!pin || isDesktop) return null

  const handleDelete = () => {
    onDelete(pin.id)
    onClose()
  }

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={handleClickOutside}
    >
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6">
          {/* Drag Handle */}
          <div className="flex-shrink-0 h-1 w-12 bg-gray-400 rounded-full mx-auto opacity-40" />

          {/* Header with Icon and Info */}
          <div className="flex gap-4">
            {/* Pin Icon */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" strokeWidth={1} />
            </div>

            {/* Title */}
            <div className="flex flex-col justify-center">
              <h2 className="text-xl font-semibold">Saved Pin</h2>
            </div>
          </div>

          {/* Latitude and Longitude Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <label className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide block mb-1">Latitude</label>
              <p className="font-mono font-semibold text-lg">{pin.latitude.toFixed(6)}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <label className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide block mb-1">Longitude</label>
              <p className="font-mono font-semibold text-lg">{pin.longitude.toFixed(6)}</p>
            </div>
          </div>

          {/* Date/Time (only shown if available) */}
          {pin.timestamp && (() => {
            const d = new Date(pin.timestamp)
            return (
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                <span>{d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="mx-2">·</span>
                <span>{d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            )
          })()}

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full btn bg-red-500 hover:bg-red-600 text-white border-red-600 py-3 rounded-lg flex items-center justify-center gap-2 text-base font-medium"
          >
            <Trash2 className="w-5 h-5" strokeWidth={1} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
