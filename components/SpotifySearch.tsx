'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface SpotifyAlbum {
  id: string
  title: string
  artist: string
  releaseYear: number
  coverImage: string
}

export interface SpotifyFill {
  title: string
  artist: string
  releaseYear: number
  coverImage: string
  genre: string
  tracks: string[]
}

interface SpotifySearchProps {
  onSelect: (data: SpotifyFill) => void
}

export default function SpotifySearch({ onSelect }: SpotifySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpotifyAlbum[]>([])
  const [searching, setSearching] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<SpotifyAlbum | null>(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      setSearching(false)
      return
    }
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.albums ?? [])
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 380)
    return () => clearTimeout(t)
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleSelect(album: SpotifyAlbum) {
    setLoadingId(album.id)
    setOpen(false)
    try {
      const res = await fetch(`/api/spotify/album/${album.id}`)
      const { tracks, genre } = await res.json()
      setSelected(album)
      setQuery('')
      onSelect({ title: album.title, artist: album.artist, releaseYear: album.releaseYear, coverImage: album.coverImage, genre, tracks })
    } catch {
      setSelected(album)
      setQuery('')
      onSelect({ title: album.title, artist: album.artist, releaseYear: album.releaseYear, coverImage: album.coverImage, genre: '', tracks: [] })
    } finally {
      setLoadingId(null)
    }
  }

  function handleChange() {
    setSelected(null)
    setResults([])
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div ref={containerRef}>
      <p className="font-mono text-[9px] tracking-[0.08em] text-warm-600 mb-2">
        search spotify
      </p>

      {selected ? (
        <div className="flex items-center gap-3 py-2 border-b border-warm-200">
          {selected.coverImage && (
            <div className="relative w-10 h-10 shrink-0 bg-warm-100">
              <Image src={selected.coverImage} alt={selected.title} fill className="object-cover" sizes="40px" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-serif text-[13px] text-warm-800 truncate">{selected.title}</p>
            <p className="font-mono text-[10px] text-warm-500">{selected.artist} · {selected.releaseYear}</p>
          </div>
          {loadingId ? (
            <span className="font-mono text-[10px] text-warm-300 animate-pulse shrink-0">fetching...</span>
          ) : (
            <button
              type="button"
              onClick={handleChange}
              className="font-mono text-[10px] text-warm-400 hover:text-warm-700 transition-colors shrink-0"
            >
              change
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2 border-b border-warm-300 focus-within:border-warm-700 transition-colors duration-200">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="type an album name..."
              className="font-mono text-[11px] text-warm-700 bg-transparent focus:outline-none py-2 flex-1 placeholder:text-warm-300"
            />
            {searching && (
              <span className="font-mono text-[10px] text-warm-300 shrink-0 animate-pulse">searching...</span>
            )}
          </div>

          {open && results.length > 0 && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-warm-50 border border-warm-200 shadow-xl max-h-72 overflow-y-auto modal-scroll">
              {results.map((album) => (
                <button
                  key={album.id}
                  type="button"
                  disabled={!!loadingId}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(album) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-warm-100 transition-colors duration-100 text-left disabled:opacity-40"
                >
                  {album.coverImage && (
                    <div className="relative w-10 h-10 shrink-0 bg-warm-100">
                      <Image src={album.coverImage} alt={album.title} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[13px] text-warm-800 truncate">{album.title}</p>
                    <p className="font-mono text-[10px] text-warm-500 truncate">{album.artist} · {album.releaseYear}</p>
                  </div>
                  {loadingId === album.id && (
                    <span className="font-mono text-[10px] text-warm-300 animate-pulse shrink-0">loading...</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
