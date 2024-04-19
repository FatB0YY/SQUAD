import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface UserAvatarProps {
  src?: string | null
  alt?: string | null
  className?: string
}

export const UserAvatar = ({ className, src, alt }: UserAvatarProps) => {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage
        src={src || undefined}
        alt={alt || undefined}
      />
      <AvatarFallback className='bg-indigo-500'>
        <User
          name='User'
          className='text-white'
        />
      </AvatarFallback>
    </Avatar>
  )
}
