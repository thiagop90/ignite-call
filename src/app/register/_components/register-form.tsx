'use client'

import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, 'O usuário deve ter no mínimo 3 letras.')
    .regex(/^([a-z\\_]+)$/i, 'O usuário pode ter apenas letras e underline.')
    .transform((username) => username.toLowerCase()),
  name: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 letras.')
    .regex(/^([a-z\\ ]+)$/i, 'O nome pode ter apenas letras.'),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export function RegisterForm() {
  const query = useSearchParams()
  const router = useRouter()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      name: '',
    },
  })

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    const username = query.get('username')
    if (username) {
      setValue('username', username)
    }
  }, [query, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        toast({
          variant: 'destructive',
          title: 'Ah, não! Algo deu errado.',
          description: err.response.data.message,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col space-y-6 rounded-md border bg-card p-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuário</FormLabel>
              <FormControl>
                <Input placeholder="Informe seu nome de usuário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Informe seu nome" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  )
}
