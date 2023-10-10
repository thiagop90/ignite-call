'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export function UpdateProfileForm() {
  const router = useRouter()
  const session = useSession()
  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('/users/profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <form
      onSubmit={handleSubmit(handleUpdateProfile)}
      className="flex flex-col space-y-6 rounded-md border bg-card p-4"
    >
      <div className="flex flex-col gap-2">
        <span>Foto de perfil</span>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={session.data?.user.avatar_url} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" disabled>
            Selecionar foto
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span>Sobre você</span>
        <Textarea {...register('bio')} />
        <span>
          Fale um pouco sobre você. Isto será exibido em sua página pessoal.
        </span>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Finalizar
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  )
}
