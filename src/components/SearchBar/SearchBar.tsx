'use client'

import { useOnClickOutside } from '@/hooks/use-onclick-outside.hook'
import { type Prisma, type Subreddit } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../ui/Command'

const SearchBar = () => {
  const [input, setInput] = useState<string>('')
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching
  } = useQuery({
    queryFn: async () => {
      if (!input) return []

      const { data } = await axios.get(`/api/search?q=${input}`)

      return data as Array<
        Subreddit & {
          _count: Prisma.SubredditCountOutputType
        }
      >
    },
    queryKey: ['search-query'],
    enabled: false
  })

  const request = debounce(async () => {
    await refetch()
  }, 300)

  const debounceRefetch = useCallback(() => {
    void request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Command
      className='relative z-50 max-w-lg overflow-visible rounded-lg border'
      ref={commandRef}
    >
      <CommandInput
        className='border-none outline-none ring-0 focus:border-none focus:outline-none'
        placeholder='Search communities...'
        value={input}
        onValueChange={(text) => {
          setInput(text)
          debounceRefetch()
        }}
        isLoading={isFetching}
      />

      {input.length > 0 && (
        <CommandList className='absolute left-0 top-full max-h-96 w-full overflow-y-auto rounded-b-lg bg-white shadow-lg'>
          {isFetched && <CommandEmpty>No results found</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 && (
            <CommandGroup heading='Communities'>
              {queryResults?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                    setInput('')
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className='mr-2 h-5 w-5' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  )
}

export default SearchBar
