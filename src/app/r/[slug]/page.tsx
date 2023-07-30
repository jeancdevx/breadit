import MiniCreatePost from '@/components/Posts/MiniCreatePost'
import PostFeed from '@/components/Posts/PostFeed'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/constants'
import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params

  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS
      }
    }
  })

  if (!subreddit) return notFound()

  return (
    <>
      <h1 className='h-14 text-3xl font-bold md:text-4xl'>
        r/{subreddit.name}
      </h1>

      <MiniCreatePost session={session} />

      {/* show posts in user feed */}
      <PostFeed
        initialPosts={subreddit.posts}
        subredditName={subreddit.name}
      />
    </>
  )
}
