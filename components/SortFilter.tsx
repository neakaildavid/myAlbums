'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Album, SortOption } from '@/lib/types'

interface SortFilterProps {
  sort: SortOption
  filter: string
  albums: Album[]
  onSortChange: (sort: SortOption) => void
  onFilterChange: (filter: string) => void
}

const chevron = (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-warm-500">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SortFilter({ sort, filter, albums, onSortChange, onFilterChange }: SortFilterProps) {
  const [mode, setMode] = useState<'artist' | 'genre'>('artist')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const artists = useMemo(() => Array.from(new Set(albums.map((a) => a.artist))).sort(), [albums])
  const genres = useMemo(() => Array.from(new Set(albums.map((a) => a.genre))).sort(), [albums])
  const list = mode === 'artist' ? artists : genres

  // What's currently selected (if any)
  const activeValue = useMemo(() => {
    if (filter.startsWith('artist:')) return { mode: 'artist', label: filter.slice(7) }
    if (filter.startsWith('genre:')) return { mode: 'genre', label: filter.slice(6) }
    return null
  }, [filter])

  // Suggestions: all items when query empty, filtered when typing
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((item) => item.toLowerCase().includes(q))
  }, [list, query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function switchMode(next: 'artist' | 'genre') {
    setMode(next)
    setQuery('')
    onFilterChange('all')
    inputRef.current?.focus()
  }

  function selectSuggestion(item: string) {
    onFilterChange(`${mode}:${item}`)
    setQuery('')
    setOpen(false)
  }

  function clearFilter() {
    onFilterChange('all')
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
  }

  function handleInputFocus() {
    setOpen(true)
  }

  return (
    <div className="flex items-end gap-10">
      {/* Sort */}
      <div>
        <label className="font-mono text-[9px] text-warm-600 tracking-[0.08em] block mb-2">sort</label>
        <div className="relative flex items-center">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none font-mono text-[11px] tracking-wide text-warm-700 bg-transparent border-b border-warm-300 focus:border-warm-700 focus:outline-none py-2 pr-6 cursor-pointer hover:border-warm-600 transition-colors duration-200 min-w-[150px]"
          >
            <option value="highest_rated">highest rated</option>
            <option value="lowest_rated">lowest rated</option>
            <option value="date_newest">date added (newest)</option>
            <option value="date_oldest">date added (oldest)</option>
            <option value="release_newest">release date (newest)</option>
            <option value="release_oldest">release date (oldest)</option>
          </select>
          <span className="absolute right-0 bottom-[10px] pointer-events-none">{chevron}</span>
        </div>
      </div>

      {/* Filter */}
      <div ref={containerRef} className="relative">
        <label className="font-mono text-[9px] text-warm-600 tracking-[0.08em] block mb-2">filter</label>

        {/* Mode toggle */}
        <div className="flex items-center gap-4 mb-2.5">
          {(['artist', 'genre'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`font-mono text-[10px] tracking-wide transition-colors duration-150 ${
                mode === m
                  ? 'text-warm-800 border-b border-warm-700'
                  : 'text-warm-400 hover:text-warm-600'
              }`}
            >
              by {m}
            </button>
          ))}
        </div>

        {/* Input + dropdown */}
        <div className="relative">
          <div className="flex items-center border-b border-warm-300 focus-within:border-warm-700 transition-colors duration-200">
            {activeValue ? (
              /* Active filter chip */
              <div className="flex items-center gap-2 py-2 flex-1">
                <span className="font-mono text-[11px] text-warm-800">{activeValue.label}</span>
                <button
                  onClick={clearFilter}
                  className="font-mono text-warm-400 hover:text-warm-800 transition-colors leading-none text-base"
                  aria-label="Clear filter"
                >
                  ×
                </button>
              </div>
            ) : (
              /* Search input */
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder={`search ${mode}s...`}
                className="font-mono text-[11px] text-warm-700 bg-transparent focus:outline-none py-2 w-44 placeholder:text-warm-300"
              />
            )}
          </div>

          {/* Autocomplete dropdown */}
          {open && !activeValue && (
            <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-warm-50 border border-warm-200 shadow-lg w-full min-w-[180px] max-h-52 overflow-y-auto">
              {suggestions.length === 0 ? (
                <p className="font-mono text-[11px] text-warm-400 px-4 py-3">no matches</p>
              ) : (
                suggestions.map((item) => (
                  <button
                    key={item}
                    onMouseDown={(e) => {
                      e.preventDefault() // prevent blur before click fires
                      selectSuggestion(item)
                    }}
                    className="w-full text-left font-mono text-[11px] text-warm-700 px-4 py-2.5 hover:bg-warm-100 hover:text-warm-900 transition-colors duration-100 block"
                  >
                    {item}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
