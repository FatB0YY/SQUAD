'use server'

import * as z from 'zod'

import { signIn, signOut } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('credentials', {
      email,
      password,
      // redirectTo: calbackUrl || DEFAULT_LOGIN_REDIRECT
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })

    return { success: 'Success!' }
  } catch (error) {
    console.error(error)
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            error: 'Invalid credentials!'
          }
        }
        default: {
          return { error: 'Something went wrong!' }
        }
      }
    }

    throw error
  }
}
