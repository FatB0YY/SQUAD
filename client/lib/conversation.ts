/**
 * findConversation находит в бд ранее созданную конференцию или вернет null
 * createNewConversation создает новую конференцию в бд
 *
 * getOrCreateConversation ф-ция, которая пытается сначала найти конференцию по айдишникам
 * иначе создает новую конференцию и ее возвращает
 */

import { db } from '@/lib/db'

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId))

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId)
  }

  return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId, memberTwoId: memberTwoId }]
      },
      include: {
        memberOne: {
          include: {
            user: true
          }
        },
        memberTwo: {
          include: {
            user: true
          }
        }
      }
    })
  } catch (error) {
    console.error('ERROR:', error)
    return null
  }
}

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId
      },
      include: {
        memberOne: {
          include: {
            user: true
          }
        },
        memberTwo: {
          include: {
            user: true
          }
        }
      }
    })
  } catch (error) {
    console.error('ERROR:', error)

    return null
  }
}
