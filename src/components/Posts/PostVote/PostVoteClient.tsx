'use client'

import { Button } from '@/components/ui/Button'
import useCustomToast from '@/hooks/use-custom-toast.hook'
import { toast } from '@/hooks/use-toast.hook'
import { cn } from '@/libs/utils'
import { type PostVoteValidatorType } from '@/libs/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { type VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { useEffect, useState, type FC } from 'react'

interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote
}) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const [isVoting, setIsVoting] = useState(false)
  const prevVote = usePrevious(currentVote)

  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteValidatorType = {
        postId,
        voteType
      }

      await axios.patch('/api/subreddit/post/vote', payload)
    },
    onError: (err, voteType) => {
      setIsVoting(false)

      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) loginToast()
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered. Please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      setIsVoting(false)
    },
    onMutate: (voteType: VoteType) => {
      setIsVoting(true)

      if (voteType === 'UP') {
        if (currentVote === 'UP') {
          setVotesAmt((prev) => prev - 1)
          setCurrentVote(null)
        } else if (currentVote === 'DOWN') {
          setVotesAmt((prev) => prev + 2)
          setCurrentVote('UP')
        } else {
          setVotesAmt((prev) => prev + 1)
          setCurrentVote('UP')
        }
      } else {
        if (currentVote === 'DOWN') {
          setVotesAmt((prev) => prev + 1)
          setCurrentVote(null)
        } else if (currentVote === 'UP') {
          setVotesAmt((prev) => prev - 2)
          setCurrentVote('DOWN')
        } else {
          setVotesAmt((prev) => prev - 1)
          setCurrentVote('DOWN')
        }
      }
    }
  })

  return (
    <div className='gap-4 pb-4 pr-6 sm:flex sm:w-20 sm:flex-col sm:gap-0 sm:pb-0'>
      <Button
        size='sm'
        variant='ghost'
        aria-label='upvote'
        disabled={isVoting}
        onClick={() => {
          vote('UP')
        }}
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote === 'UP'
          })}
        />
      </Button>

      <p className='text-center text-sm font-semibold text-zinc-700'>
        {votesAmt}
      </p>

      <Button
        size='sm'
        variant='ghost'
        aria-label='downvote'
        disabled={isVoting}
        onClick={() => {
          vote('DOWN')
        }}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-red-500 text-red-500': currentVote === 'DOWN'
          })}
        />
      </Button>
    </div>
  )
}

export default PostVoteClient
