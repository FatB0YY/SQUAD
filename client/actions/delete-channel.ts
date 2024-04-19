'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export const deleteChannel = async (serverId: string, channelId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!', status: 401 }
    }

    if (!serverId) {
      return { error: 'Server ID Missing!', status: 400 }
    }

    if (!channelId) {
      return { error: 'Channel ID Missing!', status: 400 }
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            userId: user.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    })

    return server
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!', status: 500 }
  }
}
