import { Album } from './types'

const STORAGE_KEY = 'record-albums'

export function getAlbums(): Album[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored) as Album[]
  } catch {
    return []
  }
}

export function saveAlbum(album: Album): void {
  if (typeof window === 'undefined') return
  const albums = getAlbums()
  albums.unshift(album)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums))
}

export function getAlbumById(id: string): Album | undefined {
  return getAlbums().find((a) => a.id === id)
}

export function updateAlbum(album: Album): void {
  if (typeof window === 'undefined') return
  const albums = getAlbums()
  const idx = albums.findIndex((a) => a.id === album.id)
  if (idx !== -1) {
    albums[idx] = album
    localStorage.setItem(STORAGE_KEY, JSON.stringify(albums))
  }
}

export function deleteAlbum(id: string): void {
  if (typeof window === 'undefined') return
  const albums = getAlbums().filter((a) => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums))
}

export function generateId(): string {
  return `album-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
