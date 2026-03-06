import { MapPin, Navigation, Moon, Sun, Save, File, Trash2, Layers } from 'lucide-react'
import { useState } from 'react'

export function ControlPanel({
  pinCount,
  onMyLocation,
  isFollowing,
  isDark,
  onToggleTheme,
  onZoomToAll,
  onExport,
  onImport,
  onCycleStyle,
  onDeleteAll
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteAll = () => {
    onDeleteAll()
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div className="absolute z-40 flex flex-col gap-2" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)', left: '16px' }}>
        {/* Pin Count - Split Pill Button */}
        <div
          className="glass flex items-center !rounded-full overflow-hidden text-sm font-medium"
          style={{ paddingLeft: '11px', minHeight: '44px' }}
        >
          <button
            onClick={onZoomToAll}
            className="flex items-center gap-2 py-2 flex-1"
            style={{ paddingRight: '10px' }}
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

        {/* Load + Save Row */}
        <div className="flex gap-2">
          <button
            onClick={onImport}
            className="btn glass py-2 text-sm font-medium flex items-center gap-2 !rounded-full !justify-start"
            style={{ paddingLeft: '11px', paddingRight: '19px' }}
            title="Load pins from file"
            aria-label="Load pins from file"
          >
            <File className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
            <span>Load</span>
          </button>

          <button
            onClick={onExport}
            className="btn glass py-2 text-sm font-medium flex items-center gap-2 !rounded-full !justify-start"
            style={{ paddingLeft: '11px', paddingRight: '19px' }}
            title="Save pins to file"
            aria-label="Save pins to file"
          >
            <Save className="w-5 h-5 flex-shrink-0" strokeWidth={1} />
            <span>Save</span>
          </button>
        </div>

        {/* Icon-Only Buttons Row */}
        <div className="flex gap-2">
          <button
            onClick={onMyLocation}
            className={`btn btn-icon ${isFollowing ? 'bg-blue-500' : 'glass'}`}
            title={isFollowing ? 'Following your location' : 'Go to my location'}
            aria-label={isFollowing ? 'Following your location' : 'Go to my location'}
          >
            <Navigation className="w-5 h-5" strokeWidth={1} />
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

          {!isDark && (
            <button
              onClick={onCycleStyle}
              className="btn btn-icon glass"
              title="Change map style"
              aria-label="Change map style"
            >
              <Layers className="w-5 h-5" strokeWidth={1} />
            </button>
          )}
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
