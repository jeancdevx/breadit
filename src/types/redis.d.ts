import { type VoteType } from '@prisma/client'

export interface CachePost {
  id: string
  title: string
  authorUsername: string
  content: any
  currentVote: VoteType | null
  createdAt: Date
}
