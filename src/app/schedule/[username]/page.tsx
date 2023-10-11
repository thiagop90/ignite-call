import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { prisma } from '@/lib/prisma'
import { User } from 'lucide-react'
import { cache } from 'react'
import { ScheduleForm } from './_components/schedule-form'

interface ScheduleProps {
  params: { username: string }
}

const getUser = cache(async (username: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      username,
    },
  })

  return user
})

export default async function Schedule(props: ScheduleProps) {
  const {
    params: { username },
  } = props

  const user = await getUser(username)

  return (
    <main className="mx-auto mb-4 mt-20 flex flex-col items-center space-y-6 ">
      <header className="flex flex-col items-center">
        <Avatar>
          <AvatarImage src={user.avatar_url ?? ''} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-2 text-2xl font-bold leading-relaxed">{user.name}</h2>
        <p className="leading-relaxed text-muted-foreground">{user.bio}</p>
      </header>

      <ScheduleForm username={user.username} />
    </main>
  )
}
