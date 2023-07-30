'use client'

import { Button } from '@/components/ui/Button'
import useCustomToast from '@/hooks/use-custom-toast.hook'
import { toast } from '@/hooks/use-toast.hook'
import { type SubscribeToSubredditPayload } from '@/libs/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition, type FC } from 'react'

interface SubscribeLeaveToggleProps {
  subredditId: string
  subredditName: string
  isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed
}) => {
  const { loginToast } = useCustomToast()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post('/api/subreddit/subscribe', payload)

      return data as string
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }

        return toast({
          title: 'There was an error',
          description: 'Something went wrong, please try again later',
          variant: 'destructive'
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Subscribed',
        description: `You are now subscribed to r/${subredditName}`
      })
    }
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId
      }

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload)

      return data as string
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast()
        }

        return toast({
          title: 'There was an error',
          description: 'Something went wrong, please try again later',
          variant: 'destructive'
        })
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh()
      })

      return toast({
        title: 'Unsubscribed',
        description: `You are now unsubscribed from r/${subredditName}`
      })
    }
  })

  return isSubscribed ? (
    <Button
      className='mb-4 mt-1 w-full'
      onClick={() => unsubscribe()}
      isLoading={isUnsubLoading}
    >
      Leave
    </Button>
  ) : (
    <Button
      className='mb-4 mt-1 w-full'
      onClick={() => subscribe()}
      isLoading={isSubLoading}
    >
      Subscribe
    </Button>
  )
}

export default SubscribeLeaveToggle
