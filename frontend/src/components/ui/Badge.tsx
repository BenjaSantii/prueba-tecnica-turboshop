interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'violet' | 'sky' | 'pink' | 'lime'
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[#E8E6E1] text-[#0F0E0D]',
  green:   'bg-[#2C5344] text-white',
  violet:  'bg-[#A589FF]/20 text-[#6B4FCC]',
  sky:     'bg-[#8DF3EE]/30 text-[#1A8C88]',
  pink:    'bg-[#FFABD4]/30 text-[#C0537A]',
  lime:    'bg-[#D7F58A]/40 text-[#4A7A00]',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
