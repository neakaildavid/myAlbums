'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Album } from '@/lib/types'
import PasscodeScreen from './PasscodeScreen'
import AlbumForm from './AlbumForm'

interface AddAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  onAddAlbum: (album: Album) => void
}

export default function AddAlbumModal({ isOpen, onClose, onAddAlbum }: AddAlbumModalProps) {
  const [step, setStep] = useState<'passcode' | 'form'>('passcode')

  // Reset to passcode when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setStep('passcode'), 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  function handleAddAlbum(album: Album) {
    onAddAlbum(album)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-warm-900/50 backdrop-blur-[3px] z-40"
          />

          {/* Modal panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-warm-50 w-full max-w-lg max-h-[92vh] flex flex-col pointer-events-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-warm-100 shrink-0">
                <div>
                  <h2 className="font-serif text-xl text-warm-900 leading-tight">
                    {step === 'passcode' ? 'Add an Album' : 'Album Details'}
                  </h2>
                  {step === 'form' && (
                    <p className="font-mono text-[11px] text-warm-400 mt-1">Fill in what you know</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="font-mono text-warm-400 hover:text-warm-800 transition-colors text-2xl leading-none mt-0.5"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="px-8 py-7 overflow-y-auto modal-scroll flex-1">
                <AnimatePresence mode="wait">
                  {step === 'passcode' ? (
                    <motion.div
                      key="passcode"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.18 }}
                    >
                      <PasscodeScreen onSuccess={() => setStep('form')} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.18 }}
                    >
                      <AlbumForm onSubmit={handleAddAlbum} onClose={onClose} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
