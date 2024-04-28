import { ChatHeader } from '@/components/squad/chat/chat-header'
import { currentUser } from '@/lib/auth'
import { getOrCreateConversation } from '@/lib/conversation'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface MemberIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
}

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: user.id
    },
    include: {
      user: true
    }
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  )

  // TODO: проверить редирект
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  // тк поиск конференции не гарантирует нам что memberOne это мы или memberTwo это мы
  // то мы вручную определяем кто мы, а кто другой собеседник.
  const otherMember = memberOne.userId === user.id ? memberTwo : memberOne

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full '>
      <ChatHeader
        imageUrl={otherMember.user.image || undefined}
        // TODO: исправить типы
        name={
          (otherMember.user.name as string) ||
          (otherMember.user.email as string)
        }
        serverId={params.serverId}
        type='conversation'
      />
    </div>
  )
}

export default MemberIdPage
