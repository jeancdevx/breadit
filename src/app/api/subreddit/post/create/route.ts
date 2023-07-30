import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import { PostValidatorSchema } from '@/libs/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    const body = await req.json()

    const { subredditId, title, content } = PostValidatorSchema.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id
      }
    })

    if (!subscriptionExists) {
      return new Response('You are not subscribed to this subreddit', {
        status: 400
      })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId
      }
    })

    return new Response('Post created', { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not create post, please try again later', {
      status: 500
    })
  }
}
