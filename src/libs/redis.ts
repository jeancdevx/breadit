/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_SECRET!
})
