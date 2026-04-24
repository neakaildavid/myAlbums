'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Album } from '@/lib/types'
import AlbumForm from './AlbumForm'

interface EditAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  album: Album
  onSave: (album: Album) => void
}

export default function EditAlbumModal({ isOpen, onClose, album, onSave }: EditAlbumModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-warm-900/50 backdrop-blur-[3px] z-40"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-warm-50 w-full max-w-lg max-h-[92vh] flex flex-col pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-warm-100 shrink-0">
                <div>
                  <h2 className="font-serif text-xl text-warm-900 leading-tight">edit album</h2>
                  <p className="font-mono text-[11px] text-warm-400 mt-1">all fields are editable</p>
                </div>
                <button
                  onClick={onClose}
                  className="font-mono text-warm-400 hover:text-warm-800 transition-colors text-2xl leading-none mt-0.5"
                >
                  ×
                </button>
              </div>

              <div className="px-8 py-7 overflow-y-auto modal-scroll flex-1">
                <AlbumForm onSubmit={onSave} onClose={onClose} initialData={album} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
