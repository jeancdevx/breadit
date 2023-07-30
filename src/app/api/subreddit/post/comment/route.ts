import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import { CommentValidatorSchema } from '@/libs/validators/comment'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { postId, text, replyToId } = CommentValidatorSchema.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // if no existing vote, create a new vote
    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId
      }
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response(
      'Could not post to subreddit at this time. Please try later',
      { status: 500 }
    )
  }
}
