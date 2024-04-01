import { currentRole, currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from '@/navigation'
import { ChannelType } from '@prisma/client'
import { Chennel } from '@prisma/client'
import { ServerHeader } from './server-header'

interface ServerSidebarProps {
  serverId: string
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
    </div>
  )
}
