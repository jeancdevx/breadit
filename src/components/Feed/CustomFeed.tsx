import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/constants'
import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import { notFound } from 'next/navigation'
import PostFeed from '../Posts/PostFeed'

const CustomFeed = async () => {
  const session = await getAuthSession()

  // only rendered if session exists, so this will not happen
  if (!session) return notFound()

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      subreddit: true
    }
  })

  const notFollowedCommunities = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          notIn: followedCommunities.map((sub) => sub.subreddit.name)
        }
      }
    },
    include: {
      subreddit: true
    }
  })

  if (session && followedCommunities?.length === 0) {
    // if user is not following any communities show all posts
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
  } else if (session && followedCommunities?.length > 0) {
    // if user is following communities show posts from those communities and then show posts from other communities
    const posts = await db.post.findMany({
      where: {
        subreddit: {
          name: {
            in: [
              ...followedCommunities.map((sub) => sub.subreddit.name),
              ...notFollowedCommunities.map((sub) => sub.subreddit.name)
            ]
          }
        }
      },
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
}

export default CustomFeed
