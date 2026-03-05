import { useEffect, useState } from 'react'

export function PinDialog({ pin, onDelete, onClose }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
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

  if (isMobile) {
    return (
      <div
        className="bottom-sheet"
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
    )
  }

  return (
    <div
      className="dialog-overlay"
      onClick={handleClickOutside}
    >
      <div className="dialog">
        <h2 className="text-lg font-semibold mb-4">Pin Details</h2>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide">Latitude</label>
            <p className="font-mono">{pin.latitude.toFixed(6)}</p>
          </div>
          <div>
            <label className="text-text-secondary text-xs uppercase tracking-wide">Longitude</label>
            <p className="font-mono">{pin.longitude.toFixed(6)}</p>
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
  )
}
