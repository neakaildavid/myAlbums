'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Album } from '@/lib/types'
import { getAlbumById } from '@/lib/storage'
import AlbumImage from '@/components/AlbumImage'

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

export default function AlbumDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [album, setAlbum] = useState<Album | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const found = getAlbumById(id)
    setAlbum(found ?? null)
  }, [id])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <span className="font-mono text-[11px] text-warm-400 tracking-widest animate-pulse">
          Loading...
        </span>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center gap-4">
        <p className="font-mono text-sm text-warm-500">Album not found</p>
        <Link
          href="/"
          className="font-mono text-[11px] tracking-widest text-accent hover:underline"
        >
          ← Back to RECORD
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50 relative overflow-x-hidden">
      {/* Blurred ambient background */}
      {!album.coverImage.startsWith('data:') && (
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.08] blur-[80px] scale-125 z-0"
          style={{
            backgroundImage: `url(${album.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="relative z-10">
        {/* Nav bar */}
        <nav className="max-w-screen-xl mx-auto px-6 md:px-12 pt-8 pb-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-warm-500 hover:text-warm-800 transition-colors duration-200"
          >
            <span>←</span>
            <span>RECORD</span>
          </Link>
        </nav>

        {/* Main content */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] lg:grid-cols-[400px_1fr] gap-10 md:gap-16 lg:gap-24">

            {/* Left — Album Cover */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="aspect-square w-full max-w-[400px] relative shadow-[0_20px_60px_-10px_rgba(28,26,24,0.25)]">
                <AlbumImage
                  src={album.coverImage}
                  alt={`${album.title} by ${album.artist}`}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Date added — desktop only, below cover */}
              <p className="hidden md:block font-mono text-[10px] text-warm-300 mt-5">
                Added{' '}
                {new Date(album.dateAdded).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </motion.div>

            {/* Right — Details */}
            <div className="pt-0 md:pt-1">

              {/* Artist */}
              <motion.p
                {...fadeUp}
                transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-mono text-[10px] tracking-[0.1em] text-warm-500 mb-3"
              >
                {album.artist}
              </motion.p>

              {/* Title */}
              <motion.h1
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.04] text-warm-900 mb-6"
              >
                {album.title}
              </motion.h1>

              {/* Year + Genre */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-4 mb-8 pb-8 border-b border-warm-200"
              >
                <span className="font-mono text-[11px] text-warm-500">{album.releaseYear}</span>
                <span className="w-px h-3 bg-warm-300" />
                <span className="font-mono text-[11px] text-warm-500 tracking-wider">
                  {album.genre}
                </span>
              </motion.div>

              {/* Rating */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
                className="mb-10"
              >
                <p className="font-mono text-[9px] tracking-[0.1em] text-warm-400 mb-3">
                  Rating
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[80px] md:text-[96px] leading-none text-accent font-light">
                    {album.rating.toFixed(1)}
                  </span>
                  <span className="font-mono text-xl text-warm-300 mb-1">/ 10</span>
                </div>
              </motion.div>

              {/* Notes */}
              {album.notes && (
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mb-10"
                >
                  <p className="font-mono text-[9px] tracking-[0.1em] text-warm-400 mb-4">
                    Review
                  </p>
                  <p className="font-serif text-[17px] md:text-[18px] leading-[1.75] text-warm-700 max-w-[540px]">
                    {album.notes}
                  </p>
                </motion.div>
              )}

              {/* Favorite Song */}
              {album.favoriteSong && (
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.55, delay: 0.36, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mb-8"
                >
                  <p className="font-mono text-[9px] tracking-[0.1em] text-warm-400 mb-3">
                    Favorite
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-[3px] h-7 bg-accent shrink-0" />
                    <span className="font-serif text-xl text-warm-800">{album.favoriteSong}</span>
                  </div>
                </motion.div>
              )}

              {/* Runners Up */}
              {album.runnersUp && album.runnersUp.length > 0 && (
                <motion.div
                  {...fadeUp}
                  transition={{ duration: 0.55, delay: 0.42, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <p className="font-mono text-[9px] tracking-[0.1em] text-warm-400 mb-3">
                    Highlights
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {album.runnersUp.map((song, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] text-warm-600 bg-warm-100 px-3 py-1.5"
                      >
                        {song}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Date added — mobile */}
              <p className="md:hidden font-mono text-[10px] text-warm-300 mt-10">
                Added{' '}
                {new Date(album.dateAdded).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
