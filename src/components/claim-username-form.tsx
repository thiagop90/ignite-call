'use client'

import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from './ui/form'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário deve ter no mínimo 3 letras.' })
    .regex(/^([a-z\\_]+)$/i, {
      message: 'O usuário pode ter apenas letras e underline.',
    })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const form = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
    defaultValues: {
      username: '',
    },
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <Form {...form}>
      <form
        className="mt-6 flex gap-2"
        onSubmit={handleSubmit(handleClaimUsername)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Informe seu nome de usuário" {...field} />
              </FormControl>
              <FormDescription>
                {!errors.username && 'Digite o nome do usuário desejado'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  )
}
