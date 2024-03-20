import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { InitialModal } from '@/components/modals/initial-modal'
import { db } from '@/lib/db'

const ServerPage = async () => {
  const session = await auth()

  // подумать
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: session?.user.id
        }
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}

export default ServerPage
