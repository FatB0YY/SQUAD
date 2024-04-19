'use server'

import * as z from 'zod'
import { EditChannelSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export const editChannel = async (
  values: z.infer<typeof EditChannelSchema>,
  serverId: string,
  channelId: string
) => {
  try {
    const validatedFields = EditChannelSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!', status: 400 }
    }

    const { name, type } = validatedFields.data

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

    if (name === 'general') {
      return { error: 'Name cannot be "general"', status: 400 }
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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general'
              }
            },
            data: {
              name,
              type
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
