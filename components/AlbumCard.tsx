'use client'
import Link from 'next/link'
import { Album } from '@/lib/types'
import AlbumImage from './AlbumImage'

interface AlbumCardProps {
  album: Album
  index: number
}

export default function AlbumCard({ album, index }: AlbumCardProps) {
  const delay = Math.min(index * 0.045, 0.55)

  return (
    <Link
      href={`/album/${album.id}`}
      className="album-card group block"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Cover */}
      <div className="aspect-square relative overflow-hidden bg-warm-100 mb-3.5">
        <AlbumImage
          src={album.coverImage}
          alt={`${album.title} by ${album.artist}`}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>

      {/* Meta */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-[14px] leading-snug text-warm-900 group-hover:text-accent transition-colors duration-200 flex-1 min-w-0 line-clamp-2">
            {album.title}
          </h3>
          <span className="font-mono text-[11px] text-accent shrink-0 pt-[2px]">
            {album.rating.toFixed(1)}
          </span>
        </div>
        <p className="font-mono text-[11px] text-warm-500 truncate">{album.artist}</p>
      </div>
    </Link>
  )
}
