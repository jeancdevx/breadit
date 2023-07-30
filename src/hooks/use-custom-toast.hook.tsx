import { buttonVariants } from '@/components/ui/Button'
import Link from 'next/link'
import { toast } from './use-toast.hook'

const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'Login required',
      description: 'You need to login to access this',
      variant: 'destructive',
      action: (
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href='/sign-in'
          onClick={() => {
            dismiss()
          }}
        >
          Login
        </Link>
      )
    })
  }

  return {
    loginToast
  }
}

export default useCustomToast
