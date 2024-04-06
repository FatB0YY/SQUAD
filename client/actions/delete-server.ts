'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const deleteServer = async (serverId: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!', status: 401 }
    }

    if (!serverId) {
      return { error: 'Server ID Missing!', status: 400 }
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        userId: user.id
      }
    })

    return server
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!', status: 500 }
  }
}
