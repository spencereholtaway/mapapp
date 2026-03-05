import { MapPin, Crosshair, Moon, Sun, Download, File, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function ControlPanel({
  pinCount,
  onMyLocation,
  isDark,
  onToggleTheme,
  onZoomToAll,
  onExport,
  onImport,
  uploadedFileName,
  onDeleteAll
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteAll = () => {
    onDeleteAll()
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
        {/* Pin Count - Split Pill Button */}
        <div
          className="glass flex items-center !rounded-full overflow-hidden text-sm font-medium"
          style={{ paddingLeft: '11px' }}
        >
          <button
            onClick={onZoomToAll}
            className="flex items-center gap-2 py-2"
            style={{ paddingRight: '10px', minWidth: '92px' }}
            title="Zoom to all pins"
            aria-label={`${pinCount} pins - click to zoom to all`}
          >
            <MapPin className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
            <span>{pinCount} {pinCount === 1 ? 'Pin' : 'Pins'}</span>
          </button>

          <div className="w-px self-stretch bg-current opacity-20" />

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center justify-center self-stretch opacity-50 hover:opacity-100 transition-opacity"
            style={{ width: '44px' }}
            title="Delete all pins"
            aria-label="Delete all pins"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1} />
          </button>
        </div>

        {/* Upload Button */}
        <button
          onClick={onImport}
          className="btn glass py-2 text-sm font-medium flex items-center !justify-start gap-2 !rounded-full"
          title="Load pins from file"
          aria-label="Load pins from file"
          style={{ width: '100%', paddingLeft: '11px', paddingRight: '14px' }}
        >
          <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center"><File className="w-5 h-5" strokeWidth={1} /></span>
          <span className="truncate">{uploadedFileName || 'Load'}</span>
        </button>

        {/* Icon-Only Buttons Row */}
        <div className="flex gap-2">
          <button
            onClick={onMyLocation}
            className="btn btn-icon glass"
            title="Go to my location"
            aria-label="Go to my location"
          >
            <Crosshair className="w-5 h-5" strokeWidth={1} />
          </button>

          <button
            onClick={onToggleTheme}
            className="btn btn-icon glass"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5" strokeWidth={1} />
            ) : (
              <Moon className="w-5 h-5" strokeWidth={1} />
            )}
          </button>

          <button
            onClick={onExport}
            className="btn btn-icon glass"
            title="Export pins"
            aria-label="Export pins to file"
          >
            <Download className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Delete All Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="glass rounded-2xl p-6 mx-4 flex flex-col items-center gap-4"
            style={{ maxWidth: '280px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="w-10 h-10 opacity-50" strokeWidth={1} />
            <p className="text-base font-semibold">Delete all pins?</p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleDeleteAll}
                className="btn flex-1 bg-red-500 hover:bg-red-600 text-white border-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="btn flex-1"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
