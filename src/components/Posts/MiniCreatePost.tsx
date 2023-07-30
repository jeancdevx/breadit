'use client'

import { ImageIcon, Link2 } from 'lucide-react'
import { type Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { type FC } from 'react'
import UserAvatar from '../Navbar/UserAvatar'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface MiniCreatePostProps {
  session: Session | null
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <li className='list-none overflow-hidden rounded-md bg-white shadow-md'>
      <div className='flex h-full justify-between gap-4 px-6 py-4'>
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name ?? null,
              image: session?.user.image ?? null
            }}
          />

          <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white' />
        </div>

        <Input
          readOnly
          placeholder='Create Post'
          onClick={() => router.push(`${pathname}/submit`)}
        />

        <Button
          variant='ghost'
          onClick={() => router.push(`${pathname}/submit`)}
        >
          <ImageIcon className='h-6 w-6 text-zinc-600' />
        </Button>

        <Button
          variant='ghost'
          onClick={() => router.push(`${pathname}/submit`)}
        >
          <Link2 className='h-6 w-6 text-zinc-600' />
        </Button>
      </div>
    </li>
  )
}

export default MiniCreatePost
