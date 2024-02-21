'use client'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { useGetAvailabilities } from '@/hooks/use-get-availabilities'

export interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

interface TimePickerProps {
  date: Date
  username: string
  onSelectHour(hour: number): void
}

export function TimePicker(props: TimePickerProps) {
  const { date, username, onSelectHour } = props

  const dateParam = format(date, 'yyyy-MM-dd')

  const { data: availability } = useGetAvailabilities(username, dateParam)

  const weekDayFormatted = format(date, 'eeee', { locale: ptBR })
  const dayFormatted = format(date, "dd 'de' MMMM", { locale: ptBR })

  return (
    <div className="overflow-y-auto py-6 scrollbar-thin scrollbar-track-accent scrollbar-thumb-primary scrollbar-thumb-rounded-full sm:px-6 md:absolute md:inset-y-0 md:right-0 md:w-80 md:border-l md:pb-0">
      <div className="font-medium text-muted-foreground ">
        <span className="text-white">{weekDayFormatted}, </span>
        {dayFormatted}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-1">
        {availability?.possibleTimes.map((hour) => {
          return (
            <Button
              key={hour}
              variant="outline"
              disabled={!availability.availableTimes.includes(hour)}
              onClick={() => onSelectHour(hour)}
            >
              {String(hour).padStart(2, '0')}:00h
            </Button>
          )
        })}
      </div>
      {!availability && (
        <div className="mt-2 flex items-center justify-center">
          <Loader className="h-5 w-5 animate-spin " />
        </div>
      )}
    </div>
  )
}
