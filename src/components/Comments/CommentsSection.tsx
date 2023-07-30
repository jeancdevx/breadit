import { getAuthSession } from '@/libs/auth'
import { db } from '@/libs/db'
import CreateComment from './CreateComment'
import PostComment from './PostComment'

interface CommentsSectionProps {
  postId: string
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true
        }
      }
    }
  })

  return (
    <div className='mt-4 flex flex-col gap-y-4'>
      <hr className='my-6 h-px w-full' />

      <CreateComment postId={postId} />

      <div className='mt-4 flex flex-col gap-y-6'>
        {comments
          .filter((comment: any) => !comment.replyToId)
          .map((topLevelComment: any) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc: number, vote: any) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              },
              0
            )

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote: any) => vote.userId === session?.user.id
            )

            return (
              <div
                key={topLevelComment.id}
                className='flex flex-col'
              >
                <div className='mb-2'>
                  <PostComment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                    postId={postId}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a: any, b: any) => b.votes.length - a.votes.length) // Sort replies by most liked
                  .map((reply: any) => {
                    const replyVotesAmt = reply.votes.reduce(
                      (acc: number, vote: any) => {
                        if (vote.type === 'UP') return acc + 1
                        if (vote.type === 'DOWN') return acc - 1

                        return acc
                      },
                      0
                    )

                    const replyVote = reply.votes.find(
                      (vote: any) => vote.userId === session?.user.id
                    )

                    return (
                      <div
                        key={reply.id}
                        className='ml-3 border-l-2 border-zinc-200 py-2 pl-6'
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default CommentsSection
