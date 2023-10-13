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
import { utcToZonedTime } from 'date-fns-tz'
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

  const timeZone = 'America/Sao_Paulo'
  const dateInTimeZone = utcToZonedTime(date, timeZone)

  if (isPast(endOfDay(dateInTimeZone))) {
    return NextResponse.json({ availability: [] })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
  })

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: { user_id: user.id, week_day: getDay(dateInTimeZone) },
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
    const dateOnHour = setHours(dateInTimeZone, nextHour)
    hours.push({ hour: nextHour, isAvailable: isFuture(dateOnHour) })
    nextHour = hours[hours.length - 1].hour + 1
  }

  const userSchedulings = await prisma.scheduling.findMany({
    select: { date: true },
    where: {
      user,
      date: {
        gte: setHours(dateInTimeZone, startHour),
        lte: setHours(dateInTimeZone, endHour),
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
