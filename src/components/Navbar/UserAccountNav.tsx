'use client'

import { type User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { type FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/DropdownMenu'
import UserAvatar from './UserAvatar'

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name ?? null,
            image: user.image ?? null
          }}
          className='h-8 w-8'
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='bg-white'
        align='end'
      >
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 text-center leading-none'>
            {user.name != null && (
              <p className='text-sm font-medium text-zinc-700'>{user.name}</p>
            )}
            {user.email != null && (
              <p className='w-[200px] truncate text-xs text-zinc-500'>
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='font-medium'
          asChild
        >
          <Link href='/'>Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='font-medium'
          asChild
        >
          <Link href='/r/create'>Create community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='font-medium'
          asChild
        >
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div
          className='flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-red-100 p-2 text-center text-sm font-medium text-red-700 outline-none transition-colors hover:bg-red-200/75'
          onClick={(e) => {
            e.preventDefault()

            void signOut({ callbackUrl: `${window.location.origin}/sign-in` })
          }}
        >
          Sign out
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
