'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { ChannelType } from '@prisma/client'

export const getServerData = async (serverId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!', status: 401 }
    }

    if (!serverId) {
      return { error: 'Server ID Missing!', status: 400 }
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
      return { error: `Server not found!`, status: 404 }
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

    const members = server?.members.filter(
      (member) => member.userId !== user.id
    )
    const memberRole = server.members.find(
      (member) => member.userId === user.id
    )?.role

    return {
      data: {
        textChannels,
        audioChannels,
        videoChannels,
        members,
        memberRole,
        server
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!', status: 500 }
  }
}
