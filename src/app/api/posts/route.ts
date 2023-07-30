import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import { z } from 'zod'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []
  let notFollowedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        subreddit: true
      }
    })

    const notFollowedCommunities = await db.subreddit.findMany({
      where: {
        id: {
          notIn: followedCommunities.map((sub) => sub.subreddit.id)
        }
      }
    })

    followedCommunitiesIds = followedCommunities.map((sub) => sub.subreddit.id)
    notFollowedCommunitiesIds = notFollowedCommunities.map((sub) => sub.id)
  }

  try {
    const { limit, page, subredditName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subredditName: z.string().nullish().optional()
      })
      .parse({
        subredditName: url.searchParams.get('subredditName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page')
      })

    let whereClause = {}

    if (subredditName) {
      // show posts from a specific subreddit if subredditName is not null
      whereClause = {
        subreddit: {
          name: subredditName
        }
      }
    } else if (session && followedCommunitiesIds.length > 0) {
      // first show posts from followed communities if user is logged in and following any communities and then show all posts
      whereClause = {
        subreddit: {
          id: {
            in: [...followedCommunitiesIds, ...notFollowedCommunitiesIds]
          }
        }
      }
    } else if (session && followedCommunitiesIds.length === 0) {
      // show all posts if user is logged in but not following any communities
      whereClause = {}
    } else {
      // show all posts if user is not logged in
      whereClause = {}
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        subreddit: true,
        votes: true,
        author: true,
        comments: true
      },
      where: whereClause
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}
