import SignIn from '@/components/Sign/SignIn'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/libs/utils'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  return (
    <section className='absolute inset-0'>
      <article className='mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20'>
        <Link
          href='/'
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            '-mt-20 self-start'
          )}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Home
        </Link>

        <SignIn />
      </article>
    </section>
  )
}

export default page
