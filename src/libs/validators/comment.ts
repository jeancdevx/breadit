import { z } from 'zod'

export const CommentValidatorSchema = z.object({
  postId: z.string(),
  text: z.string().min(1).max(1000),
  replyToId: z.string().optional()
})

export type CommentValidatorType = z.infer<typeof CommentValidatorSchema>
