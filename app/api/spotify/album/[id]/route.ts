import { NextRequest, NextResponse } from 'next/server'
import { getSpotifyToken } from '@/lib/spotify'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getSpotifyToken()

    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!albumRes.ok) return NextResponse.json({ tracks: [], genre: '' })

    const album = await albumRes.json()
    const tracks: string[] = (album.tracks?.items ?? []).map(
      (t: { name: string }) => t.name
    )

    let genre = ''
    const artistId = album.artists?.[0]?.id
    if (artistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 86400 },
      })
      if (artistRes.ok) {
        const artist = await artistRes.json()
        genre = (artist.genres as string[])?.[0] ?? ''
      }
    }

    return NextResponse.json({ tracks, genre })
  } catch {
    return NextResponse.json({ tracks: [], genre: '' })
  }
}
