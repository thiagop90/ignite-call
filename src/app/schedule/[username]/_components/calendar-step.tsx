'use client'

import { useState } from 'react'
import { TimePicker } from '@/app/schedule/[username]/_components/time-picker'
import { Calendar } from '@/components/ui/calendar'
import {
  endOfDay,
  getMonth,
  getYear,
  isPast,
  isSameDay,
  parseISO,
  setHours,
  startOfHour,
} from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { utcToZonedTime } from 'date-fns-tz'

type UserBlockedDatesResponse = {
  blockedDates: string[]
}

interface CalendarStepProps {
  username: string
  onSelectDateTime(date: Date): void
}

export function CalendarStep(props: CalendarStepProps) {
  const { username, onSelectDateTime } = props
  const [selectedDay, setSelectedDay] = useState<Date>()

  const today = new Date()
  const [month, setMonth] = useState<Date>(today)

  const handleMonthChange = (newMonth: Date) => {
    if (getMonth(newMonth) !== currentMonth) {
      setSelectedDay(undefined)
    }
    setMonth(newMonth)
  }

  const currentMonth = getMonth(month)
  const currentYear = month.getFullYear()

  const { data: blockedDates } = useQuery<Date[]>(
    ['blocked-dates', { username, month: currentMonth, year: currentYear }],
    async () => {
      const response = await api.get<UserBlockedDatesResponse>(
        `/users/${username}/blocked-dates`,
        {
          params: {
            month: currentMonth,
            year: currentYear,
          },
        },
      )

      return response.data.blockedDates.map((blockedDate) => {
        return parseISO(blockedDate)
      })
    },
  )

  const isDateDisabled = (date: Date): boolean => {
    const isPastDate = isPast(endOfDay(date))
    if (isPastDate) {
      return true
    }

    if (blockedDates) {
      return blockedDates.some((blockedDate) => isSameDay(blockedDate, date))
    }

    return false
  }

  function handleSelectHour(hour: number) {
    if (!selectedDay) return

    const dateTime = startOfHour(setHours(selectedDay, hour))
    onSelectDateTime(dateTime)
  }

  return (
    <div
      className={`relative grid grid-cols-1 sm:rounded-md sm:border sm:bg-card ${
        selectedDay && 'md:grid-cols-[1fr_320px]'
      }`}
    >
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        disabled={isDateDisabled}
        month={month}
        onMonthChange={handleMonthChange}
        blockedDates={blockedDates}
      />
      {selectedDay && (
        <TimePicker
          date={selectedDay}
          username={username}
          onSelectHour={handleSelectHour}
        />
      )}
    </div>
  )
}
