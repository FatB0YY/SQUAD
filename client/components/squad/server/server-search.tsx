'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

interface Item {
  icon: React.ReactNode
  name: string
  id: string
}

interface ServerSearchProps {
  data: {
    label: string
    type: 'channel' | 'member'
    items: Item[]
  }[]
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const onClick = ({
    id,
    type
  }: {
    id: string
    type: 'channel' | 'member'
  }) => {
    setIsOpen(false)

    if (type === 'member') {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }

    if (type === 'channel') {
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
      >
        <Search
          name='search'
          className='w-4 h-4 text-zinc-500 dark:text-zinc-400'
        />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </button>
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>No Results found</CommandEmpty>
          {data.map(({ label, type, items }) => {
            if (!data?.length) return null

            return (
              <CommandGroup
                key={label}
                heading={label}
              >
                {items?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                    >
                      {/* TODO: при наведении показывать роль */}
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
