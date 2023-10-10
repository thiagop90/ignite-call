'use client'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'

type AvailableHour = {
  hour: number
  isAvailable: boolean
}

interface TimePickerProps {
  date: Date
  username: string
  onSelectHour(hour: number): void
}

type Availability = AvailableHour[]

export function TimePicker(props: TimePickerProps) {
  const { date, username, onSelectHour } = props

  const dateParam = format(date, 'yyyy-MM-dd')

  const { data: availability } = useQuery<Availability>(
    ['availability', { username, date: dateParam }],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: dateParam,
        },
      })

      return response.data.availability
    },
  )

  const weekDayFormatted = format(date, 'eeee', { locale: ptBR })
  const dayFormatted = format(date, "dd 'de' MMMM", { locale: ptBR })

  return (
    <div className="overflow-y-auto bg-card px-6 pb-6 scrollbar-thin scrollbar-track-muted scrollbar-thumb-primary scrollbar-thumb-rounded-full md:absolute md:inset-y-0 md:right-0 md:w-80 md:border-l md:pt-6">
      <div className="font-medium text-muted-foreground ">
        <span className="text-white">{weekDayFormatted},</span> {dayFormatted}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 overflow-y-auto md:grid-cols-1">
        {availability?.map((availableHour) => {
          return (
            <Button
              variant="outline"
              key={availableHour.hour.toString()}
              disabled={!availableHour.isAvailable}
              // className="rounded-md bg-gray-600 p-2 text-sm text-gray-100 transition-all last:mb-6 hover:bg-gray-500 disabled:bg-transparent disabled:opacity-40"
              onClick={() => onSelectHour(availableHour.hour)}
            >
              {`${availableHour.hour.toString().padStart(2, '0')}:00h`}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
