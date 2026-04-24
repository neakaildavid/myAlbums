'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const PASSCODE = 'brentFaiyaz'

interface PasscodeScreenProps {
  onSuccess: () => void
}

export default function PasscodeScreen({ onSuccess }: PasscodeScreenProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === PASSCODE) {
      onSuccess()
    } else {
      setError(true)
      setShakeKey((k) => k + 1)
      setValue('')
      setTimeout(() => setError(false), 2200)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[260px] py-8">
      <p className="font-mono text-[10px] tracking-[0.1em] text-warm-400 mb-10">
        Enter Passcode
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-[260px]">
        <motion.div
          key={shakeKey}
          animate={
            shakeKey > 0
              ? { x: [-10, 10, -8, 8, -4, 4, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="••••••••••••"
            className={`
              w-full font-mono text-center text-sm tracking-[0.3em] bg-transparent
              border-b-2 py-3 focus:outline-none transition-colors duration-200
              placeholder:tracking-[0.1em]
              ${error
                ? 'border-red-400 text-red-400 placeholder:text-red-300'
                : 'border-warm-300 text-warm-800 focus:border-warm-700 placeholder:text-warm-300'
              }
            `}
          />
          {error && (
            <p className="font-mono text-[11px] text-red-400 text-center mt-3 tracking-wide">
              Incorrect passcode
            </p>
          )}
        </motion.div>

        <button
          type="submit"
          className="w-full mt-8 font-mono text-[11px] tracking-[0.08em] py-3.5 bg-warm-900 text-warm-50 hover:bg-accent transition-colors duration-200"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
