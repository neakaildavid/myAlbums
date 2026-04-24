'use client'
import { useState, useRef } from 'react'
import { Album } from '@/lib/types'
import { generateId } from '@/lib/storage'
import RatingInput from './RatingInput'
import SpotifySearch, { SpotifyFill } from './SpotifySearch'

interface AlbumFormProps {
  onSubmit: (album: Album) => void
  onClose: () => void
  initialData?: Album
}

const label = 'font-mono text-[9px] tracking-[0.08em] text-warm-400 block mb-2'
const input =
  'w-full font-mono text-[13px] bg-transparent border-b border-warm-200 focus:border-warm-700 focus:outline-none py-2 text-warm-800 placeholder:text-warm-300 transition-colors duration-200'

export default function AlbumForm({ onSubmit, onClose, initialData }: AlbumFormProps) {
  const isEditing = !!initialData
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    artist: initialData?.artist ?? '',
    releaseYear: initialData?.releaseYear ?? new Date().getFullYear(),
    genre: initialData?.genre ?? '',
    rating: initialData?.rating ?? 7.0,
    notes: initialData?.notes ?? '',
    favoriteSong: initialData?.favoriteSong ?? '',
    runnersUp: initialData?.runnersUp ?? [] as string[],
    coverImage: initialData?.coverImage ?? '',
    tracks: initialData?.tracks ?? [] as string[],
  })
  const [runnerInput, setRunnerInput] = useState('')
  const [preview, setPreview] = useState<string | null>(initialData?.coverImage ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  function handleSpotifySelect(data: SpotifyFill) {
    setForm((prev) => ({
      ...prev,
      title: data.title,
      artist: data.artist,
      releaseYear: data.releaseYear,
      coverImage: data.coverImage,
      genre: data.genre,
      tracks: data.tracks,
    }))
    if (data.coverImage) setPreview(data.coverImage)
  }

  function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreview(result)
      set('coverImage', result)
    }
    reader.readAsDataURL(file)
  }

  function addRunner() {
    const t = runnerInput.trim()
    if (t && !form.runnersUp.includes(t)) {
      set('runnersUp', [...form.runnersUp, t])
      setRunnerInput('')
    }
  }

  function removeRunner(song: string) {
    set('runnersUp', form.runnersUp.filter((s) => s !== song))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const album: Album = {
      id: initialData?.id ?? generateId(),
      ...form,
      coverImage:
        form.coverImage ||
        `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 9000) + 1000}`,
      dateAdded: initialData?.dateAdded ?? new Date().toISOString(),
    }
    onSubmit(album)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Spotify search */}
      <SpotifySearch onSelect={handleSpotifySelect} />

      <div className="border-t border-warm-100 pt-6 space-y-6">

        {/* Cover */}
        <div>
          <p className={label}>album cover</p>
          <div
            onClick={() => fileRef.current?.click()}
            className="h-32 border border-dashed border-warm-300 flex items-center justify-center cursor-pointer hover:border-warm-500 transition-colors duration-200 overflow-hidden relative"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono text-[11px] text-warm-400 tracking-wide">
                click to upload · or leave for a random cover
              </span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
        </div>

        {/* Two-col fields */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label className={label}>album name *</label>
            <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)} className={input} placeholder="title" />
          </div>
          <div>
            <label className={label}>artist *</label>
            <input type="text" required value={form.artist} onChange={(e) => set('artist', e.target.value)} className={input} placeholder="artist" />
          </div>
          <div>
            <label className={label}>release year</label>
            <input type="number" min="1900" max={new Date().getFullYear()} value={form.releaseYear} onChange={(e) => set('releaseYear', parseInt(e.target.value))} className={input} />
          </div>
          <div>
            <label className={label}>genre</label>
            <input type="text" value={form.genre} onChange={(e) => set('genre', e.target.value)} className={input} placeholder="e.g. r&b, jazz" />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className={label}>rating (0–10)</label>
          <RatingInput value={form.rating} onChange={(v) => set('rating', v)} />
        </div>

        {/* Notes */}
        <div>
          <label className={label}>notes / review</label>
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} className={`${input} resize-none`} rows={4} placeholder="your thoughts on this album..." />
        </div>

        {/* Favorite Song */}
        <div>
          <label className={label}>favorite song</label>
          <input type="text" value={form.favoriteSong} onChange={(e) => set('favoriteSong', e.target.value)} className={input} placeholder="your favorite track" />
        </div>

        {/* Runners Up */}
        <div>
          <label className={label}>runners up</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={runnerInput}
              onChange={(e) => setRunnerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addRunner() }
                if (e.key === ',') { e.preventDefault(); addRunner() }
              }}
              className={`${input} flex-1`}
              placeholder="song name, press enter"
            />
            <button type="button" onClick={addRunner} className="font-mono text-sm text-warm-400 hover:text-accent border-b border-warm-200 px-2 transition-colors duration-200">+</button>
          </div>
          {form.runnersUp.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.runnersUp.map((song) => (
                <span key={song} className="font-mono text-[11px] text-warm-600 bg-warm-100 px-3 py-1 flex items-center gap-1.5">
                  {song}
                  <button type="button" onClick={() => removeRunner(song)} className="text-warm-400 hover:text-warm-800 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-warm-100">
          <button type="button" onClick={onClose} className="flex-1 font-mono text-[11px] tracking-[0.06em] py-3 border border-warm-300 text-warm-600 hover:border-warm-500 transition-colors duration-200">cancel</button>
          <button type="submit" className="flex-1 font-mono text-[11px] tracking-[0.06em] py-3 bg-warm-900 text-warm-50 hover:bg-accent transition-colors duration-200">{isEditing ? 'save changes' : 'add to record'}</button>
        </div>

      </div>
    </form>
  )
}
