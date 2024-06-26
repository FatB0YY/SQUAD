import { auth } from '@/auth'
import { InitialModal } from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { redirect } from '@/navigation'

const ServerPage = async () => {
  const session = await auth()

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
