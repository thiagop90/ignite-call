import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import { addHours, endOfDay, isPast, startOfHour } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createScheduleBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  observations: z.string().optional(),
  date: z.coerce.date(),
})

interface CreateScheduleProps {
  params: {
    username: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: CreateScheduleProps,
) {
  const requestBody = await request.json()
  const username = params.username

  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
  })

  const { email, name, observations, date } =
    createScheduleBodySchema.parse(requestBody)

  const schedulingDate = startOfHour(date)
  const brazilianTimeZone = 'America/Sao_Paulo'

  const startDateTime = utcToZonedTime(
    schedulingDate,
    brazilianTimeZone,
  ).toISOString()

  const endDateTime = utcToZonedTime(
    addHours(schedulingDate, 1),
    brazilianTimeZone,
  ).toISOString()

  if (isPast(endOfDay(schedulingDate))) {
    throw new Error('Date is in the past')
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: { user, date: schedulingDate },
  })

  if (conflictingScheduling) {
    throw new Error('There is already an scheduling on this date and time.')
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      user_id: user.id,
      email,
      name,
      observations,
      date: schedulingDate,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: startDateTime,
      },
      end: {
        dateTime: endDateTime,
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return new NextResponse(undefined, { status: 201 })
}
