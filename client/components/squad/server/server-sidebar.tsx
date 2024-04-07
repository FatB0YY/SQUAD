import {
  LuHash,
  LuMic,
  LuShieldAlert,
  LuShieldCheck,
  LuVideo
} from 'react-icons/lu'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from '@/navigation'
import { ChannelType, MemberRole } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ServerHeader } from './server-header'
import { ServerSearch } from './server-search'

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <LuHash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <LuMic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <LuVideo className='mr-2 h-4 w-4' />
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <LuShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />
  ),
  [MemberRole.ADMIN]: <LuShieldAlert className='mr-2 h-4 w-4 text-rose-500' />
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          user: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  })

  if (!server) {
    return redirect('/')
  }

  const textChannels = []
  const audioChannels = []
  const videoChannels = []

  // TODO: сортировка на сервере
  for (const channel of server?.channels || []) {
    if (channel.type === ChannelType.TEXT) {
      textChannels.push(channel)
    }
    if (channel.type === ChannelType.AUDIO) {
      audioChannels.push(channel)
    }
    if (channel.type === ChannelType.VIDEO) {
      videoChannels.push(channel)
    }
  }

  const members = server?.members.filter((member) => member.userId !== user.id)
  const memberRole = server.members.find(
    (member) => member.userId === user.id
  )?.role

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader
        server={server}
        role={memberRole}
      />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                items: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                items: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                items: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: 'Members',
                type: 'member',
                items: members?.map((member) => ({
                  id: member.id,
                  name: member.user.name as string, // TODO: проверить тип
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
