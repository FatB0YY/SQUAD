'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export const roleChangeMember = async (
  memberId: string,
  role: MemberRole,
  serverId: string
) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { error: 'Unauthorized!', status: 401 }
    }

    if (!serverId) {
      return { error: 'Server ID Missing!', status: 400 }
    }

    if (!memberId) {
      return { error: 'Member ID Missing!', status: 400 }
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        userId: user.id
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              userId: {
                not: user.id
              }
            },
            data: {
              role
            }
          }
        }
      },
      include: {
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

    return server
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!', status: 500 }
  }
}
