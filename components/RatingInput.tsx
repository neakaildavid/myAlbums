'use client'

interface RatingInputProps {
  value: number
  onChange: (val: number) => void
}

export default function RatingInput({ value, onChange }: RatingInputProps) {
  const pct = (value / 10) * 100

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(Math.round(parseFloat(e.target.value) * 10) / 10)
  }

  function handleNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const n = parseFloat(e.target.value)
    if (!isNaN(n) && n >= 0 && n <= 10) {
      onChange(Math.round(n * 10) / 10)
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-5">
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={handleSlider}
          className="rating-slider flex-1"
          style={{ '--slider-pct': `${pct}%` } as React.CSSProperties}
        />
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={handleNumber}
          className="font-mono text-sm text-accent w-14 text-center bg-transparent border-b border-warm-300 focus:border-accent focus:outline-none py-1"
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-warm-400 px-px">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )
}
