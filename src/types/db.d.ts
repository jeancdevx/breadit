import {
  type Comment,
  type Post,
  type Subreddit,
  type User,
  type Vote
} from '@prisma/client'

export type ExtendedPost = Post & {
  subreddit: Subreddit
  votes: Vote[]
  author: User
  comments: Comment[]
}
