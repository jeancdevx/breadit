import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import SubscribeLeaveToggle from './components/SubscribeLeaveToggle'

export default async function Layout({
  children,
  params: { slug }
}: {
  children: React.ReactNode
  params: {
    slug: string
  }
}) {
  const session = await getAuthSession()

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true
        }
      }
    }
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug
          },
          user: {
            id: session.user.id
          }
        }
      })

  const isSubscribed = !!subscription

  if (!subreddit) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug
      }
    }
  })

  return (
    <section className='mx-auto h-full max-w-7xl pt-12 sm:container'>
      {/* button to take us back */}

      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        <section className='col-span-2 flex flex-col space-y-6'>
          {children}
        </section>

        {/* info sidebar */}
        <aside className='order-first hidden h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last md:block'>
          <header className='bg-zinc-100 px-6 py-4'>
            <h2 className='py-3 font-semibold'>About r/{subreddit.name}</h2>
          </header>

          <dl className='divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-gray-500'>Created</dt>
              <dd className='text-gray-700'>
                <time dateTime={subreddit.createdAt.toDateString()}>
                  {format(subreddit.createdAt, 'MMM d, yyyy')}
                </time>
              </dd>
            </div>

            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-gray-500'>Members</dt>
              <dd className='text-gray-900'>
                <span className='font-semibold'>
                  {memberCount} member{memberCount === 1 ? '' : 's'}
                </span>
              </dd>
            </div>

            {subreddit.creatorId === session?.user?.id && (
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-gray-500'>You created this community</dt>
              </div>
            )}

            {subreddit.creatorId !== session?.user?.id && (
              <SubscribeLeaveToggle
                subredditId={subreddit.id}
                subredditName={subreddit.name}
                isSubscribed={isSubscribed}
              />
            )}

            <Link
              className={buttonVariants({
                variant: 'outline',
                className: 'mb-6 w-full'
              })}
              href={`/r/${slug}/submit`}
            >
              Create Post
            </Link>
          </dl>
        </aside>
      </div>
    </section>
  )
}
