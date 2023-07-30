import { formatTimeToNow } from '@/libs/utils'
import { type Post, type User, type Vote } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useRef, type FC } from 'react'
import EditorOutput from '../Editor/EditorOutput'
import PostVoteClient from './PostVote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  subredditName: string
  currentVote?: PartialVote
  commentAmt: number
}

const PostComponent: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  votesAmt: _votesAmt,
  currentVote: _currentVote
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  return (
    <article className='rounded-md bg-white shadow'>
      <aside className='flex justify-between px-6 py-4'>
        {/* post votes */}
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={_votesAmt}
          initialVote={_currentVote?.type}
        />

        <div className='w-0 flex-1'>
          <header className='mt-1 max-h-40 text-xs text-gray-500'>
            {subredditName ? (
              <>
                <a
                  className='text-sm font-semibold text-zinc-900'
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span className='font-medium text-zinc-400'>
              Posted by u/{post.author.username}
            </span>{' '}
            <span className='font-medium text-zinc-400'>
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </header>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h2 className='py-2 text-lg font-semibold leading-6 text-gray-900'>
              {post.title}
            </h2>
          </a>

          <section
            // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
            className='relative max-h-40 w-full overflow-clip text-sm'
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent' />
            ) : null}
          </section>
        </div>
      </aside>

      <footer className='z-20 bg-gray-50 p-4 text-sm sm:px-6'>
        <Link
          href={`/r/${subredditName}/post/${post.id}`}
          className='flex w-fit items-center gap-2'
        >
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </footer>
    </article>
  )
}

export default PostComponent
