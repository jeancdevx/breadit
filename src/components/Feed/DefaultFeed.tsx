import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/constants'
import { db } from '@/libs/db'
import PostFeed from '../Posts/PostFeed'

const DefaultFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS
  })

  return <PostFeed initialPosts={posts} />
}

export default DefaultFeed
