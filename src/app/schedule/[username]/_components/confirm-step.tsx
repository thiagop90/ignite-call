'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { Calendar, Clock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome precisa no mínimo 3 caracteres.' }),
  email: z.string().email({ message: 'Digite um e-mail válido.' }),
  observations: z.string().optional(),
})

type ConfirmFormInput = z.input<typeof confirmFormSchema>
type ConfirmFormOutput = z.output<typeof confirmFormSchema>

interface ConfirmStepProps {
  username: string
  schedulingDate: Date
  clearSelectedDateTime(): void
}

export function ConfirmStep(props: ConfirmStepProps) {
  const { username, schedulingDate, clearSelectedDateTime } = props

  const { toast } = useToast()

  const form = useForm<ConfirmFormInput, unknown, ConfirmFormOutput>({
    defaultValues: {
      name: '',
      email: '',
      observations: '',
    },
    resolver: zodResolver(confirmFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  async function handleConfirmScheduling(formData: ConfirmFormOutput) {
    try {
      await api.post(`/users/${username}/schedule`, {
        name: formData.name,
        email: formData.email,
        observations: formData.observations,
        date: schedulingDate,
      })

      clearSelectedDateTime()
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          toast({
            title: 'Erro do servidor',
            description: error.response.data.message,
          })
        }
      }
    }
  }

  const schedulingDateFormatted = format(
    schedulingDate,
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR },
  )
  const schedulingDateHourFormatted = format(schedulingDate, "HH:mm'h'", {
    locale: ptBR,
  })

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-[540px] flex-col space-y-4 rounded-md border bg-card p-4 sm:space-y-6 sm:p-6"
        onSubmit={handleSubmit(handleConfirmScheduling)}
      >
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>{schedulingDateFormatted}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{schedulingDateHourFormatted}</span>
          </div>
        </div>

        <Separator />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu nome</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço de e-mail</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={clearSelectedDateTime}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Confirmar
          </Button>
        </div>
      </form>
    </Form>
  )
}
