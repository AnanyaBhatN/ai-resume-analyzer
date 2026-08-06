import { motion } from 'framer-motion'

interface CircularScoreProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

function getColor(score: number) {
  if (score >= 75) return '#16A34A'
  if (score >= 50) return '#2563EB'
  if (score >= 30) return '#F59E0B'
  return '#DC2626'
}

export function CircularScore({ score, size = 120, strokeWidth = 10, label }: CircularScoreProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getColor(score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EFF6FF" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      {label && <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>}
    </div>
  )
}
