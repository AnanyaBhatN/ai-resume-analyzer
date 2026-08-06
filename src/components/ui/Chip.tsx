import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type ChipTone = 'primary' | 'success' | 'danger' | 'warning' | 'neutral'

const toneClasses: Record<ChipTone, string> = {
  primary: 'bg-primary-50 text-primary-700 border-primary-100',
  success: 'bg-green-50 text-green-700 border-green-100',
  danger: 'bg-red-50 text-red-700 border-red-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  neutral: 'bg-gray-50 text-gray-600 border-gray-200',
}

export function Chip({ children, tone = 'primary', icon, className }: { children: ReactNode; tone?: ChipTone; icon?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
