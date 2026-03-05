import { MapPin, Crosshair, Moon, Sun, Download, File } from 'lucide-react'

export function ControlPanel({
  pinCount,
  onMyLocation,
  isDark,
  onToggleTheme,
  onZoomToAll,
  onExport,
  onImport,
  uploadedFileName
}) {
  return (
    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
      {/* Pin Count Button - Full Width with Text */}
      <button
        onClick={onZoomToAll}
        className="btn glass py-2 text-sm font-medium flex items-center gap-2 !rounded-full"
        title="Zoom to all pins"
        aria-label={`${pinCount} pins - click to zoom to all`}
        style={{ width: '100%', paddingLeft: '11px', paddingRight: '14px' }}
      >
        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center"><MapPin className="w-5 h-5" /></span>
        <span>Pins</span>
        <span className="font-bold ml-auto">{pinCount}</span>
      </button>

      {/* Upload Button - Full Width with Text */}
      <button
        onClick={onImport}
        className="btn glass py-2 text-sm font-medium flex items-center !justify-start gap-2 !rounded-full"
        title="Load pins from file"
        aria-label="Load pins from file"
        style={{ width: '100%', paddingLeft: '11px', paddingRight: '14px' }}
      >
        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center"><File className="w-5 h-5" /></span>
        <span className="truncate">{uploadedFileName || 'Load'}</span>
      </button>

      {/* Icon-Only Buttons Row */}
      <div className="flex gap-2">
        {/* My Location Button - Crosshair Icon */}
        <button
          onClick={onMyLocation}
          className="btn btn-icon glass"
          title="Go to my location"
          aria-label="Go to my location"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="btn btn-icon glass"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="btn btn-icon glass"
          title="Export pins"
          aria-label="Export pins to file"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
