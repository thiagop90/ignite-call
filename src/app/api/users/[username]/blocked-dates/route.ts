import { prisma } from '@/lib/prisma'
import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  isSameDay,
  startOfMonth,
} from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

interface UserBlockedDatesProps {
  params: {
    username: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: UserBlockedDatesProps,
) {
  const username = params.username
  const yearParam = request.nextUrl.searchParams.get('year')
  const monthParam = request.nextUrl.searchParams.get('month')

  if (!yearParam) {
    throw new Error('No year param')
  }
  if (!monthParam) {
    throw new Error('No month param')
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return NextResponse.json(
      { message: 'Usuário não exisite' },
      { status: 400 },
    )
  }

  const numericYearParam = parseInt(yearParam, 10)
  const numericMonthParam = parseInt(monthParam, 10)

  if (isNaN(numericYearParam) || isNaN(numericMonthParam)) {
    throw new Error('Invalid year or month param')
  }

  const userTimeIntervals = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
      time_end_in_minutes: true,
      time_start_in_minutes: true,
    },
    where: { user },
  })

  const blockedWeekDays = Array.from(Array(7).keys()).filter(
    (weekDay) =>
      !userTimeIntervals.some(
        (availableWeekDay) => availableWeekDay.week_day === weekDay,
      ),
  )

  const referenceDate = new Date(numericYearParam, numericMonthParam)
  const firstDay = startOfMonth(referenceDate)
  const lastDay = endOfMonth(referenceDate)

  const userSchedulings = await prisma.scheduling.findMany({
    select: { date: true },
    where: {
      user,
      date: {
        gte: firstDay,
        lte: lastDay,
      },
    },
  })

  const blockedDates: Date[] = []

  eachDayOfInterval({
    start: firstDay,
    end: lastDay,
  }).forEach((date) => {
    const weekDay = getDay(date)

    const userTimeIntervalOfDay = userTimeIntervals.find((availableDay) => {
      return availableDay.week_day === weekDay
    })

    if (!userTimeIntervalOfDay) {
      blockedDates.push(date)
    } else {
      const {
        time_start_in_minutes: timeStartInMinutes,
        time_end_in_minutes: timeEndInMinutes,
      } = userTimeIntervalOfDay

      const availableHours = (timeEndInMinutes - timeStartInMinutes) / 60
      const schedulingsOfDay = userSchedulings.filter((scheduling) => {
        return isSameDay(scheduling.date, date)
      })

      if (schedulingsOfDay.length >= availableHours) {
        blockedDates.push(date)
      }
    }
  })

  // console.log(blockedDates)

  return NextResponse.json({
    blockedWeekDays,
    blockedDates,
  })
}
