'use client'
import { useState, useRef, useEffect } from 'react'

interface TrackAutocompleteProps {
  value: string
  onChange: (val: string) => void
  onSelect?: (val: string) => void // if provided, called on suggestion click instead of onChange
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  tracks: string[]
  excludes?: string[]
  placeholder?: string
  className?: string
}

export default function TrackAutocomplete({
  value,
  onChange,
  onSelect,
  onKeyDown,
  tracks,
  excludes = [],
  placeholder,
  className = '',
}: TrackAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasTracks = tracks.length > 0

  const suggestions = tracks
    .filter((t) => !excludes.map((e) => e.toLowerCase()).includes(t.toLowerCase()))
    .filter((t) => !value.trim() || t.toLowerCase().includes(value.toLowerCase()))

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
    if (hasTracks) setOpen(true)
  }

  function handleFocus() {
    if (hasTracks) setOpen(true)
  }

  function handleSuggestionClick(track: string) {
    if (onSelect) {
      onSelect(track)
    } else {
      onChange(track)
    }
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {open && hasTracks && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-warm-50 border border-warm-200 shadow-lg max-h-44 overflow-y-auto modal-scroll">
          {suggestions.map((track) => (
            <button
              key={track}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(track) }}
              className="w-full text-left font-mono text-[11px] text-warm-700 px-4 py-2 hover:bg-warm-100 transition-colors duration-100 block"
            >
              {track}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
