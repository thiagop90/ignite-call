'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana!',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início.',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export function TimeIntervalsForm() {
  const router = useRouter()
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
    resolver: zodResolver(timeIntervalsFormSchema),
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    name: 'intervals',
    control,
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals(formData: TimeIntervalsFormOutput) {
    await api.post('/users/time-intervals', {
      intervals: formData.intervals,
    })

    router.push('/register/update-profile')
  }

  return (
    <form
      className="flex flex-col rounded-md border bg-card p-4"
      onSubmit={handleSubmit(handleSetTimeIntervals)}
    >
      <div className="mb-4 divide-y rounded-md border">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="flex items-center justify-between  px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <Checkbox
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true)
                        }}
                        checked={field.value}
                      />
                    )
                  }}
                />
                <Label>{weekDays[field.weekDay]}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  step={60}
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.startTime`)}
                />
                <Input
                  type="time"
                  step={60}
                  disabled={intervals[index].enabled === false}
                  {...register(`intervals.${index}.endTime`)}
                />
              </div>
            </div>
          )
        })}
      </div>
      {errors.intervals && (
        <span className="mb-4 text-sm text-destructive">
          {errors.intervals.root?.message}
        </span>
      )}

      <Button type="submit" disabled={isSubmitting}>
        Próximo passo
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  )
}
