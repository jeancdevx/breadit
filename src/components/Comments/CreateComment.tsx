'use client'

import useCustomToast from '@/hooks/use-custom-toast.hook'
import { toast } from '@/hooks/use-toast.hook'
import { type CommentValidatorType } from '@/libs/validators/comment'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState, type FC } from 'react'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { loginToast } = useCustomToast()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentValidatorType) => {
      const payload: CommentValidatorType = {
        postId,
        text,
        replyToId
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)

      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    }
  })

  return (
    <div className='grid w-full gap-1.5'>
      <Label
        htmlFor='comment'
        className='text-lg font-medium'
      >
        Your comment
      </Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder='What are your thoughts?'
          className='resize-none'
        />

        <div className='mt-2 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0 || isLoading}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
