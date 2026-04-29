import Link from 'next/link'

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#E8E6E1] bg-[#FAF9F6]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[#2C5344] flex items-center justify-center">
            <span className="text-white text-xs font-bold tracking-tight">TS</span>
          </div>
          <span className="font-heading font-semibold text-[#0F0E0D] text-sm tracking-tight">
            TurboShop
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-[#0F0E0D]/60 hover:text-[#0F0E0D] transition-colors duration-150"
          >
            Catálogo
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D7F58A] animate-pulse" />
            <span className="text-xs text-[#0F0E0D]/50 font-mono">live</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
