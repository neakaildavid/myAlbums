import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/lib/spotify'

interface SpotifyArtist { id: string; name: string }
interface SpotifyImage { url: string }
interface SpotifyAlbumResult {
  id: string
  name: string
  artists: SpotifyArtist[]
  release_date: string
  images: SpotifyImage[]
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ albums: [] })

  try {
    const token = await getSpotifyToken()
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=album&limit=8&market=US`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    )
    if (!res.ok) return NextResponse.json({ albums: [] })

    const data = await res.json()
    const albums = ((data.albums?.items ?? []) as SpotifyAlbumResult[])
      .filter(Boolean)
      .map((album) => ({
        id: album.id,
        title: album.name,
        artist: album.artists.map((a) => a.name).join(', '),
        releaseYear: parseInt((album.release_date ?? '0').split('-')[0]),
        coverImage: album.images?.[0]?.url ?? '',
        artistId: album.artists?.[0]?.id ?? '',
      }))

    return NextResponse.json({ albums })
  } catch {
    return NextResponse.json({ albums: [] })
  }
}
