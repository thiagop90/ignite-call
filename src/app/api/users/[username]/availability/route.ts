import { prisma } from '@/lib/prisma'
import {
  endOfDay,
  getDay,
  getHours,
  isFuture,
  isPast,
  parse,
  setHours,
} from 'date-fns'
import { NextRequest, NextResponse } from 'next/server'

type AvailableHour = {
  hour: number
  isAvailable: boolean
}

interface UserAvailabilityProps {
  params: {
    username: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: UserAvailabilityProps,
) {
  const username = params.username
  const queryDate = request.nextUrl.searchParams.get('date')

  if (!queryDate) {
    throw new Error('No date param')
  }

  const date = parse(queryDate ?? '', 'yyyy-MM-dd', new Date())

  if (isPast(endOfDay(date))) {
    return NextResponse.json({ availability: [] })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
  })

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: { user, week_day: getDay(date) },
  })

  if (!userAvailability) {
    return NextResponse.json({ availability: [] })
  }

  const {
    time_start_in_minutes: timeStartInMinutes,
    time_end_in_minutes: timeEndInMinutes,
  } = userAvailability

  const startHour = timeStartInMinutes / 60
  const endHour = timeEndInMinutes / 60

  const hours: AvailableHour[] = []
  let nextHour = startHour
  while (nextHour < endHour) {
    const dateOnHour = setHours(date, nextHour)
    hours.push({ hour: nextHour, isAvailable: isFuture(dateOnHour) })
    nextHour = hours[hours.length - 1].hour + 1
  }

  const userSchedulings = await prisma.scheduling.findMany({
    select: { date: true },
    where: {
      user,
      date: {
        gte: setHours(date, startHour),
        lte: setHours(date, endHour),
      },
    },
  })

  userSchedulings.forEach((userScheduling) => {
    const hourOfSceduling = getHours(userScheduling.date)
    const hour = hours.find((eachHour) => {
      return eachHour.hour === hourOfSceduling
    })

    if (hour) {
      hour.isAvailable = false
    }
  })

  return NextResponse.json({
    userAvailability,
    userSchedulings,
    availability: hours,
  })
}
