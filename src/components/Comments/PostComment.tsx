/* eslint-disable @typescript-eslint/restrict-template-expressions */

'use client'

import { useOnClickOutside } from '@/hooks/use-onclick-outside.hook'
import { toast } from '@/hooks/use-toast.hook'
import { formatTimeToNow } from '@/libs/utils'
import { type CommentValidatorType } from '@/libs/validators/comment'
import { type Comment, type CommentVote, type User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useRef, useState, type FC } from 'react'
import UserAvatar from '../Navbar/UserAvatar'
import { Button } from '../ui/Button'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import CommentVotes from './CommentVotes'

type ExtendedComment = Comment & {
  votes: Comment[]
  author: User
}

interface PostCommentProps {
  comment: ExtendedComment
  votesAmt: number
  currentVote: CommentVote | undefined
  postId: string
}

const PostComment: FC<PostCommentProps> = ({
  comment,
  votesAmt,
  currentVote,
  postId
}) => {
  const { data: session } = useSession()
  const [isReplying, setIsReplying] = useState<boolean>(false)
  const [input, setInput] = useState<string>(`@${comment.author.username} `)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const commentRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })

  const { mutate: postComment, isLoading: isLoadingPostComment } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentValidatorType) => {
      const payload: CommentValidatorType = {
        postId,
        text,
        replyToId
      }

      const { data } = await axios.patch('/api/subreddit/post/comment', payload)

      return data
    },
    onError: () => {
      setIsSubmitting(false)

      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()
      setIsReplying(false)
      setInput('')
      setIsSubmitting(false)
    }
  })

  return (
    <div
      ref={commentRef}
      className='flex flex-col'
    >
      <div className='flex items-center'>
        <UserAvatar
          user={{
            name: comment.author.name ?? null,
            image: comment.author.image ?? null
          }}
          className='h-6 w-6'
        />
        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text-gray-900'>
            u/{comment.author.username}
          </p>

          <p className='max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className='mt-2 text-sm text-zinc-900'>
        {/* verify if there is in the text a username ex. @WMSO0RPO9j */}
        {comment.text.split(' ').map((word) => {
          if (word.startsWith('@')) {
            return (
              <span
                key={word}
                className='font-medium text-emerald-600'
              >
                {word}{' '}
              </span>
            )
          }

          return <span key={word}>{word} </span>
        })}
      </p>

      <div className='flex items-center gap-2'>
        <CommentVotes
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push('/sign-in')
            setIsReplying(true)
          }}
          variant='ghost'
          size='xs'
        >
          <MessageSquare className='mr-1.5 h-4 w-4' />
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className='grid w-full gap-1.5'>
          <Label htmlFor='comment'>Your comment</Label>
          <div className='mt-2'>
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                )
              }
              autoFocus
              id='comment'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder='What are your thoughts?'
              disabled={isSubmitting}
            />

            <div className='mt-2 flex justify-end gap-2'>
              <Button
                tabIndex={-1}
                variant='subtle'
                onClick={() => {
                  setIsReplying(false)
                  setInput(`@${comment.author.username} `)
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                isLoading={isLoadingPostComment}
                onClick={() => {
                  if (!input) return

                  setIsSubmitting(true)

                  postComment({
                    postId,
                    text: input,
                    replyToId: comment.replyToId ?? comment.id // default to top-level comment
                  })
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostComment
