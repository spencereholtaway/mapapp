import { MapPin, Trash2 } from 'lucide-react'

export function PinDialog({ pin, onDelete, onClose }) {
  console.log('PinDialog mounted with pin:', pin)

  const handleDelete = () => {
    onDelete(pin.id)
    onClose()
  }

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const droppedDate = new Date(pin.id)
  const formattedDate = droppedDate.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit'
  })
  const formattedTime = droppedDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return (
    <>
      {/* Mobile Bottom Sheet */}
      <div
        className="bottom-sheet md:hidden"
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}, {formattedTime}</p>
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

      {/* Desktop Tooltip Popup */}
      <div className="hidden md:block fixed inset-0 z-40 bg-black/20" onClick={handleClickOutside}>
        <div
          className="glass rounded-lg p-5 w-72 shadow-xl relative absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-gray-700 text-sm"
          >
            ✕
          </button>

          {/* Header with Icon and Title */}
          <div className="flex gap-3 mb-4 pr-6">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-400 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" strokeWidth={1} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Saved Pin</h2>
              <p className="text-xs text-gray-500">Dropped: {formattedDate}, {formattedTime}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4 text-sm">
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Latitude</label>
              <p className="font-mono">{pin.latitude.toFixed(6)}</p>
            </div>
            <div>
              <label className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Longitude</label>
              <p className="font-mono">{pin.longitude.toFixed(6)}</p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full btn bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 flex items-center justify-center gap-2 py-2 text-sm"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1} />
            Delete Pin
          </button>
        </div>
      </div>
    </>
  )
}
