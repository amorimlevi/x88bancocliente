import { LucideProps } from 'lucide-react'

type IconSize = 'sm' | 'md' | 'lg'

interface IconProps extends Omit<LucideProps, 'size'> {
  size?: IconSize
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
}

export const getIconSize = (size: IconSize = 'md') => sizeMap[size]

export const UserIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const EyeIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const EyeOffIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export const ArrowDownIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
)

export const CreditCardIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

export const WalletIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
)

export const EuroIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M19 6.5C17.46 4.93 15.36 4 13 4c-4.42 0-8 3.58-8 8s3.58 8 8 8c2.36 0 4.46-.93 6-2.5" />
    <path d="M2 9h7" />
    <path d="M2 15h7" />
  </svg>
)

export const CheckIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const XIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export const ClockIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export const LogOutIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export const HomeIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

export const HistoryIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

export const QrCodeIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
    <path d="M14 14h7v7h-7z"/>
  </svg>
)

export const BellIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

export const LockIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export const PlusIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

export const PiggyBankIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/>
    <circle cx="13" cy="11" r="1"/>
  </svg>
)

export const UserPlusIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
)

export const GridIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
)

export const ArrowLeftIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

export const MapPinIcon = ({ size = 'md', ...props }: IconProps) => (
  <svg width={getIconSize(size)} height={getIconSize(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)
