import { z } from 'zod'

export const PostVoteValidatorSchema = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN'])
})

export type PostVoteValidatorType = z.infer<typeof PostVoteValidatorSchema>

export const CommentVoteValidatorSchema = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN'])
})

export type CommentVoteValidatorType = z.infer<
  typeof CommentVoteValidatorSchema
>
