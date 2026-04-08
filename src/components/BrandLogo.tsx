'use client'
import Image from 'next/image'
import { BRAND_LOGOS, getBrandMeta } from '@/data/brands'

interface Props {
  brand: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP = {
  sm: { px: 28, cls: 'w-7 h-7' },
  md: { px: 40, cls: 'w-10 h-10' },
  lg: { px: 56, cls: 'w-14 h-14' },
}

export default function BrandLogo({ brand, size = 'md', className = '' }: Props) {
  const logo = BRAND_LOGOS[brand]
  const meta = getBrandMeta(brand)
  const { px, cls } = SIZE_MAP[size]

  if (logo) {
    return (
      <div className={`${cls} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 ${meta.darkBg ? 'bg-black p-1' : 'bg-white p-1'} ${className}`}>
        <Image src={logo} alt={`${brand} logo`} width={px} height={px}
          className="object-contain w-full h-full" unoptimized/>
      </div>
    )
  }
  return (
    <div className={`${cls} rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold border border-gray-100 ${meta.bg} ${meta.text} ${className}`}>
      {meta.short}
    </div>
  )
}
