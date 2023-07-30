'use client'

import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast.hook'
import { cn } from '@/libs/utils'
import { signIn } from 'next-auth/react'
import { useState, type FC } from 'react'
import { Icons } from '../Icons'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error logging in with Google',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn('flex justify-center', className)}
      {...props}
    >
      <Button
        isLoading={isLoading}
        type='button'
        size='sm'
        className='w-full'
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className='mr-2 h-4 w-4' />}
        Sign in with Google
      </Button>
    </div>
  )
}

export default UserAuthForm
