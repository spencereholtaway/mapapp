import { MapPin, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PinDialog({ pin, onDelete, onClose, hoveredPin, hoveredPinPosition, onHoverLeave }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDelete = () => {
    onDelete(pin.id)
    onClose()
  }

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleTooltipMouseLeave = () => {
    if (onHoverLeave) {
      onHoverLeave()
    }
  }

  // For desktop tooltip positioning
  const tooltipStyle = hoveredPinPosition ? {
    position: 'fixed',
    left: `${hoveredPinPosition.x}px`,
    top: `${Math.max(hoveredPinPosition.y - 12, 10)}px`,
    transform: 'translate(-50%, -100%)',
    pointerEvents: 'auto',
    zIndex: 50
  } : {}

  // Only show bottom sheet on mobile
  if (!isDesktop && pin) {
    return (
      <div
        className="bottom-sheet"
        onClick={handleClickOutside}
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

            {/* Title and Timestamp */}
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

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full btn bg-red-500 hover:bg-red-600 text-white border-red-600 py-3 rounded-lg flex items-center justify-center gap-2 text-base font-medium"
          >
            <Trash2 className="w-5 h-5" strokeWidth={1} />
            Delete This Pin
          </button>
        </div>
      </div>
    )
  }

  // Desktop: show hover tooltip
  if (isDesktop && hoveredPin) {
    return (
      <div
        style={tooltipStyle}
        className="fixed z-50 pointer-events-none"
      >
        <div
          className="glass rounded-lg px-3 py-2 w-48 shadow-lg pointer-events-auto border border-white/20"
          onMouseLeave={handleTooltipMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Icon and Title */}
          <div className="flex gap-2 mb-2">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-400 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white" strokeWidth={1} />
            </div>
            <div>
              <h3 className="text-xs font-semibold">Saved Pin</h3>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-0.5 mb-2 text-xs">
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide block">Lat</label>
              <p className="font-mono text-xs">{hoveredPin.latitude.toFixed(6)}</p>
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide block">Lng</label>
              <p className="font-mono text-xs">{hoveredPin.longitude.toFixed(6)}</p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => {
              onDelete(hoveredPin.id)
            }}
            className="w-full btn bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 flex items-center justify-center gap-1 py-0.5 text-xs"
          >
            <Trash2 className="w-3 h-3" strokeWidth={1} />
            Delete
          </button>
        </div>
      </div>
    )
  }

  // Nothing to show
  return null
}
