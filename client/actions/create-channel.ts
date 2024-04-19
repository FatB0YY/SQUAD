'use server'

import * as z from 'zod'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { CreateChannelSchema } from '@/schemas'
import { MemberRole } from '@prisma/client'

export const createChannel = async (
  values: z.infer<typeof CreateChannelSchema>,
  serverId: string
) => {
  try {
    const validatedFields = CreateChannelSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const { name, type } = validatedFields.data

    const user = await currentUser()

    if (!user || !user.id) {
      return { error: 'Unauthorized!', status: 401 }
    }

    if (!serverId) {
      return { error: 'Server ID Missing!', status: 400 }
    }

    if (name === 'general') {
      return { error: 'Name cannot be "general"!', status: 400 }
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
          create: {
            userId: user.id,
            name,
            type
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
