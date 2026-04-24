'use client'
import { useState, useEffect, useMemo } from 'react'
import { Album, SortOption } from '@/lib/types'
import { getAlbums, saveAlbum } from '@/lib/storage'
import Header from '@/components/Header'
import AlbumCard from '@/components/AlbumCard'
import SortFilter from '@/components/SortFilter'
import AddAlbumModal from '@/components/AddAlbumModal'

function sorted(albums: Album[], sort: SortOption, filter: string): Album[] {
  let result = [...albums]

  if (filter !== 'all') {
    if (filter.startsWith('artist:')) {
      const a = filter.slice(7)
      result = result.filter((x) => x.artist === a)
    } else if (filter.startsWith('genre:')) {
      const g = filter.slice(6)
      result = result.filter((x) => x.genre === g)
    }
  }

  switch (sort) {
    case 'highest_rated':   result.sort((a, b) => b.rating - a.rating); break
    case 'lowest_rated':    result.sort((a, b) => a.rating - b.rating); break
    case 'date_newest':     result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()); break
    case 'date_oldest':     result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()); break
    case 'release_newest':  result.sort((a, b) => b.releaseYear - a.releaseYear); break
    case 'release_oldest':  result.sort((a, b) => a.releaseYear - b.releaseYear); break
  }

  return result
}

export default function HomePage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>('date_newest')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    setAlbums(getAlbums())
  }, [])

  const displayed = useMemo(() => sorted(albums, sort, filter), [albums, sort, filter])

  function handleAdd(album: Album) {
    saveAlbum(album)
    setAlbums(getAlbums())
    setModalOpen(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <span className="font-mono text-[11px] text-warm-400 tracking-widest animate-pulse">
          Loading...
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <Header onAddAlbum={() => setModalOpen(true)} />

      <main className="max-w-screen-xl mx-auto px-6 md:px-12 pt-10 pb-20">
        {/* Controls row — only shown when there are albums */}
        {albums.length > 0 && (
          <div className="flex items-end justify-between mb-12">
            <SortFilter
              sort={sort}
              filter={filter}
              albums={albums}
              onSortChange={setSort}
              onFilterChange={setFilter}
            />
            <p className="font-mono text-[11px] text-warm-400">
              {displayed.length} {displayed.length === 1 ? 'album' : 'albums'}
            </p>
          </div>
        )}

        {/* Grid */}
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3">
            {albums.length === 0 ? (
              <>
                <p className="font-mono text-[13px] text-warm-400">nothing here yet</p>
                <p className="font-mono text-[11px] text-warm-300">add your first album to get started</p>
              </>
            ) : (
              <>
                <p className="font-mono text-[13px] text-warm-400">no albums found</p>
                <p className="font-mono text-[11px] text-warm-300">try a different filter</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-12">
            {displayed.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>
        )}
      </main>

      <AddAlbumModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddAlbum={handleAdd}
      />
    </div>
  )
}
