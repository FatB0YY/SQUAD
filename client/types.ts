import { User, Member, Server } from '@prisma/client'

export type ServerWithMembersWithUsers = Server & {
  members: (Member & { user: User })[]
}
