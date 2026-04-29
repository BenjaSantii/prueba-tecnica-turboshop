import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = '', ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-[#0F0E0D]/40 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-[#E8E6E1] bg-white px-3 py-2 text-sm text-[#0F0E0D] placeholder:text-[#0F0E0D]/40 outline-none focus:border-[#2C5344] focus:ring-2 focus:ring-[#2C5344]/10 transition-all duration-150 ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
