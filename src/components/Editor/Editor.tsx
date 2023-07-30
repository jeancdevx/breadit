/* eslint-disable @typescript-eslint/no-misused-promises */
'use client'

import { toast } from '@/hooks/use-toast.hook'
import { uploadFiles } from '@/libs/uploadthing'
import {
  PostValidatorSchema,
  type PostCreationRequestPayload
} from '@/libs/validators/post'
import type EditorJS from '@editorjs/editorjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from '../ui/Button'

interface EditorProps {
  subredditId: string
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PostCreationRequestPayload>({
    resolver: zodResolver(PostValidatorSchema),
    defaultValues: {
      subredditId,
      title: '',
      content: null
    }
  })

  const ref = useRef<EditorJS>()
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link'
            }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles([file], 'imageUploader')

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl
                    }
                  }
                }
              }
            }
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed
        }
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [, value] of Object.entries(errors)) {
        toast({
          title: 'Something went wrong',
          description: (value as { message: string }).message,
          variant: 'destructive'
        })
      }
    }
  }, [errors])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef.current?.focus()
      }, 0)
    }

    if (isMounted) {
      void init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId
    }: PostCreationRequestPayload) => {
      const payload: PostCreationRequestPayload = {
        subredditId,
        title,
        content
      }

      const { data } = await axios.post('/api/subreddit/post/create', payload)

      return data
    },
    onError: () => {
      setIsLoading(false)

      return toast({
        title: 'Something went wrong',
        description: 'Your post could not be created. Please try again.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      setIsLoading(false)

      // r/mycommunity/submit into r/mycommunity
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname)

      router.refresh()

      return toast({
        title: 'Success',
        description: 'Your post has been created.',
        variant: 'default'
      })
    }
  })

  async function onSubmit(data: PostCreationRequestPayload) {
    setIsLoading(true)

    const blocks = await ref.current?.save()

    const payload: PostCreationRequestPayload = {
      title: data.title,
      content: blocks,
      subredditId
    }

    createPost(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...titleProps } = register('title')

  return (
    <>
      <div className='w-full rounded-lg border border-zinc-200 bg-zinc-50'>
        <form
          id='subreddit-post-form'
          className='w-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='prose prose-stone dark:prose-invert w-full p-4'>
            <TextareaAutosize
              className='w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none md:text-4xl'
              placeholder='Title'
              ref={(e) => {
                titleRef(e)

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                _titleRef.current = e
              }}
              {...titleProps}
              disabled={isLoading}
            />

            <div
              id='editor'
              className={`min-h-[300px] ${
                isLoading ? 'pointer-events-none' : ''
              }`}
            />

            <p className='text-sm text-gray-500'>
              Use{' '}
              <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
                Tab
              </kbd>{' '}
              to open the command menu.
            </p>
          </div>
        </form>
      </div>

      <div className='flex w-full justify-end'>
        <Button
          type='submit'
          className='w-full'
          form='subreddit-post-form'
          isLoading={isLoading}
        >
          Post
        </Button>
      </div>
    </>
  )
}

export default Editor
