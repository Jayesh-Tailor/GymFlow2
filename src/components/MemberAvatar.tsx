interface MemberAvatarProps {
  initials: string
  color: string
  size?: 'small' | 'large'
}

export default function MemberAvatar({ initials, color, size = 'small' }: MemberAvatarProps) {
  return (
    <span className={`member-avatar member-avatar--${color} member-avatar--${size}`} aria-hidden="true">
      {initials}
    </span>
  )
}
