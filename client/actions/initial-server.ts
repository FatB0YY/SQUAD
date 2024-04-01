'use server'

import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { getTranslations } from 'next-intl/server'

import { ServerInitialSchema } from '@/schemas'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export const initialServer = async (
  values: z.infer<typeof ServerInitialSchema>
) => {
  const validatedFields = ServerInitialSchema.safeParse(values)
  // const t = await getTranslations('initialServerAction')

  if (!validatedFields.success) {
    // return { error: t('invalidFields') }
    return { error: 'Invalid fields!' }
  }

  const existingUser = await currentUser()

  if (!existingUser || !existingUser.id) {
    return { error: 'Unauthorized' }
  }

  const { image, name } = values

  try {
    const server = await db.server.create({
      data: {
        userId: existingUser.id,
        name,
        image,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', userId: existingUser.id }]
        },
        members: {
          create: [{ userId: existingUser.id, role: MemberRole.ADMIN }]
        }
      }
    })

    return { success: 'The server has been created!', server }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Something went wrong!' }
  }
}
