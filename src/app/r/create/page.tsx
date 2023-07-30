'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import useCustomToast from '@/hooks/use-custom-toast.hook'
import { toast } from '@/hooks/use-toast.hook'
import { type CreateSubredditPayload } from '@/libs/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [input, setInput] = useState('')
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input
      }

      const { data } = await axios.post('/api/subreddit', payload)

      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Subreddit already exists',
            description: 'Please choose a different subreddit name.',
            variant: 'destructive'
          })
        }

        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid subreddit name',
            description: 'Please choose a name between 3 and 21 characters.',
            variant: 'destructive'
          })
        }

        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive'
      })
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`)
    }
  })

  return (
    <section className='container mx-auto flex h-full max-w-3xl items-center'>
      <article className='relative h-fit w-full space-y-6 rounded-lg bg-white p-4'>
        <header className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>Create a community</h1>
        </header>

        <hr className='h-px bg-zinc-500' />

        <div>
          <h2 className='text-lg font-medium'>Name</h2>
          <p className='pb-2 text-xs'>
            Community names including capitalization cannot be changed.
          </p>
        </div>

        <div className='relative cursor-pointer'>
          <label
            htmlFor='community-name'
            className='absolute inset-y-0 left-0 grid w-8 cursor-pointer place-items-center text-sm text-zinc-400'
          >
            r/
          </label>

          <Input
            id='community-name'
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            className='pl-6 font-semibold text-zinc-700'
          />
        </div>

        <div className='flex justify-end gap-4'>
          <Button
            variant='subtle'
            onClick={() => {
              router.back()
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => {
              createCommunity()
            }}
          >
            Create a community
          </Button>
        </div>
      </article>
    </section>
  )
}
