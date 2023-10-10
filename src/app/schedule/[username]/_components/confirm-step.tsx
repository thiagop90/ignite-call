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
import { zodResolver } from '@hookform/resolvers/zod'
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

type ConfirmFormData = z.infer<typeof confirmFormSchema>

export function ConfirmStep() {
  const form = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form

  function handleConfirmScheduling(data: ConfirmFormData) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-[540px] flex-col space-y-4 rounded-md border bg-card p-4 sm:space-y-6 sm:p-6"
        onSubmit={handleSubmit(handleConfirmScheduling)}
      >
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>05 de outubro de 2022</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>22:00h</span>
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
          <Button variant="ghost">Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            Confirmar
          </Button>
        </div>
      </form>
    </Form>
  )
}
