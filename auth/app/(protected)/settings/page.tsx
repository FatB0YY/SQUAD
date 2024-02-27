import { auth, signOut } from '@/auth'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <form
      action={async () => {
        // позже реализация также будет для use client
        'use server'

        await signOut()
      }}
    >
      <button type='submit'>Sign out</button>
    </form>
  )
}

export default SettingsPage
