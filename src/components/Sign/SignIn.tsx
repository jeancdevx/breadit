import { UserAuthForm } from '@/components/UserAuthForm'
import Link from 'next/link'
import { Icons } from '../Icons'

const SignIn = () => {
  return (
    <aside className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <header className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />

        <h1 className='text-2xl font-semibold tracking-tighter'>
          Welcome back!
        </h1>
        <p className='mx-auto max-w-xs text-sm'>
          By continuing, you are setting up a Breadit account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </header>

      {/* sign in form */}
      <UserAuthForm />

      <p className='px-8 text-center text-sm text-zinc-700'>
        New to Breadit?{' '}
        <Link
          href='/sign-up'
          className='font-semibold text-zinc-900 hover:text-zinc-800'
        >
          Sign up
        </Link>
      </p>
    </aside>
  )
}

export default SignIn
