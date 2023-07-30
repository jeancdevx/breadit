import { getAuthSession } from '@/libs/auth'
import Link from 'next/link'
import { Icons } from '../Icons'
import { SearchBar } from '../SearchBar'
import { buttonVariants } from '../ui/Button'
import UserAccountNav from './UserAccountNav'

const Navbar = async () => {
  const session = await getAuthSession()

  return (
    <nav className='fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2'>
      <div className='container mx-auto flex h-full max-w-7xl items-center justify-between gap-6'>
        {/* logo */}
        <Link
          href='/'
          className='flex items-center gap-2'
        >
          <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' />
          <p className='hidden text-sm font-semibold text-zinc-700 md:block'>
            Breadit
          </p>
        </Link>

        {/* search bar */}
        <SearchBar />

        {/* auth buttons */}
        {session?.user != null ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link
            href='/sign-in'
            className={buttonVariants()}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
