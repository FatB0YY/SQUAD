'use server'

import * as z from 'zod'

import { v4 as uuidv4 } from 'uuid'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { EditServerSchema } from '@/schemas'

export const editServer = async (
  values: z.infer<typeof EditServerSchema>,
  serverId: string
) => {
  try {
    const validatedFields = EditServerSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid Fields!' }
    }

    const { imageUrl, name } = validatedFields.data

    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!', status: 401 }
    }

    if (!serverId) {
      return { error: 'Server ID Missing!', status: 400 }
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        name,
        image: imageUrl
      }
    })

    return server
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!', status: 500 }
  }
}
