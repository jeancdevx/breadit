import { z } from 'zod'

export const SubredditValidatorSchema = z.object({
  name: z.string().min(3).max(21)
})

export const SubredditSubscriptionSchema = z.object({
  subredditId: z.string()
})

export type CreateSubredditPayload = z.infer<typeof SubredditValidatorSchema>
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionSchema
>
