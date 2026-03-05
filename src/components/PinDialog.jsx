import { MapPin, Trash2 } from 'lucide-react'

export function PinDialog({ pin, onDelete, onClose }) {
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
    month: '1-digit',
    day: '2-digit',
    year: '2-digit'
  })
  const formattedTime = droppedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
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
        <div className="flex flex-col gap-4">
          <div className="flex-shrink-0 h-1 w-12 bg-gray-400 rounded-full mx-auto opacity-40" />

          <div>
            <h2 className="text-lg font-semibold mb-3">Pin Details</h2>
            <div className="space-y-2 text-sm">
              <div>
                <label className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Latitude</label>
                <p className="font-mono text-base">{pin.latitude.toFixed(6)}</p>
              </div>
              <div>
                <label className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Longitude</label>
                <p className="font-mono text-base">{pin.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="btn flex-1"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              className="btn flex-1 bg-red-500 hover:bg-red-600 text-white border-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Card Popup */}
      <div
        className="hidden md:flex fixed inset-0 z-50 items-center justify-center"
        onClick={handleClickOutside}
      >
        <div className="glass rounded-lg p-6 w-80 shadow-xl">
          {/* Pin Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" strokeWidth={1} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-center mb-4">Saved Pin</h2>

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide">Dropped</label>
              <p className="text-sm">{formattedDate}, {formattedTime}</p>
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide">Latitude</label>
              <p className="font-mono text-sm">{pin.latitude.toFixed(6)}</p>
            </div>
            <div>
              <label className="text-text-secondary text-xs uppercase tracking-wide">Longitude</label>
              <p className="font-mono text-sm">{pin.longitude.toFixed(6)}</p>
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full btn bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1} />
            Delete Pin
          </button>
        </div>
      </div>
    </>
  )
}
