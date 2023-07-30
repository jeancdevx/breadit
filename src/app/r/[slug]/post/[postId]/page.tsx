import CommentsSection from '@/components/Comments/CommentsSection'
import EditorOutput from '@/components/Editor/EditorOutput'
import PostVoteServer from '@/components/Posts/PostVote/PostVoteServer'
import { buttonVariants } from '@/components/ui/Button'
import { db } from '@/libs/db'
import { redis } from '@/libs/redis'
import { formatTimeToNow } from '@/libs/utils'
import { type CachePost } from '@/types/redis'
import { type Post, type User, type Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface PageProps {
  params: {
    postId: string
  }
}

const Page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as unknown as CachePost

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId
      },
      include: {
        votes: true,
        author: true
      }
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <>
      <article className='flex h-full flex-col items-center justify-between sm:flex-row sm:items-start'>
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId
                },
                include: {
                  votes: true
                }
              })
            }}
          />
        </Suspense>

        <div className='w-full flex-1 rounded-sm bg-white p-4 sm:w-0'>
          <p className='mt-1 max-h-40 truncate text-xs text-gray-500'>
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>

          <h1 className='py-2 text-xl font-semibold leading-6 text-gray-900'>
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Loader2 className='h-5 w-5 animate-spin text-zinc-500' />
            }
          >
            {/* @ts-expect-error Server Component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </article>
    </>
  )
}

function PostVoteShell() {
  return (
    <div className='flex w-20 flex-col items-center pr-6'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
      </div>

      {/* score */}
      <div className='py-2 text-center text-sm font-medium text-zinc-900'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-zinc-700' />
      </div>
    </div>
  )
}

export default Page
