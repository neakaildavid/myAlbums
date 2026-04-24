'use client'
import Image from 'next/image'

interface AlbumImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export default function AlbumImage({
  src,
  alt,
  className = '',
  fill = true,
  sizes,
  priority = false,
}: AlbumImageProps) {
  const isDataUrl = src.startsWith('data:') || src.startsWith('blob:')

  if (isDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${fill ? 'absolute inset-0 w-full h-full' : ''} object-cover ${className}`}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={`object-cover ${className}`}
      sizes={sizes ?? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'}
      priority={priority}
    />
  )
}
