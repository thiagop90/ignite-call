import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import dayjs from 'dayjs'

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
    return NextResponse.json({ message: 'Date not provided' }, { status: 400 })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
  })

  if (!user) {
    return NextResponse.json(
      { message: 'User does not exists' },
      { status: 400 },
    )
  }

  const referenceDate = dayjs(String(queryDate))

  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return NextResponse.json({ availability: [], possibleTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return NextResponse.json({ availability: [], possibleTimes: [] })
  }

  const {
    time_start_in_minutes: timeStartInMinute,
    time_end_in_minutes: timeEndInMinute,
  } = userAvailability

  const startHour = timeStartInMinute / 60
  const endHour = timeEndInMinute / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime: { date: Date }) => blockedTime.date.getHours() === time,
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return NextResponse.json({
    possibleTimes,
    availableTimes,
  })
}
