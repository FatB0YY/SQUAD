'use server'

import { v4 as uuidv4 } from 'uuid'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export const generateInviteLinkServer = async (serverId: string) => {
  try {
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
        inviteCode: uuidv4()
      }
    })

    return server
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!', status: 500 }
  }
}
