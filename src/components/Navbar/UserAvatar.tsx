import { type AvatarProps } from '@radix-ui/react-avatar'
import { type User } from 'next-auth'
import Image from 'next/image'
import { type FC } from 'react'
import { Icons } from '../Icons'
import { Avatar, AvatarFallback } from '../ui/Avatar'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          <Image
            fill
            src={user.image}
            alt={`${user.name ?? 'Unknown'}'s avatar`}
            referrerPolicy='no-referrer'
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>
            {user.name ?? 'Unknown'}
            <Icons.user className='h-6 w-6' />
          </span>
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export default UserAvatar
