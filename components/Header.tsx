'use client'

interface HeaderProps {
  onAddAlbum: () => void
}

export default function Header({ onAddAlbum }: HeaderProps) {
  return (
    <header className="border-b border-warm-200 bg-warm-50/90 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl tracking-[-0.025em] text-warm-900 leading-none">
            RECORD
          </h1>
          <p className="font-mono text-[10px] text-warm-400 tracking-[0.12em] mt-1.5">
            Personal Music Journal
          </p>
        </div>

        <button
          onClick={onAddAlbum}
          className="font-mono text-[11px] tracking-[0.08em] px-5 py-2.5 border border-warm-800 text-warm-800 hover:bg-warm-900 hover:text-warm-50 hover:border-warm-900 transition-all duration-200"
        >
          + Add Album
        </button>
      </div>
    </header>
  )
}
