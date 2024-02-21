import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions(cookies()))

  if (!session) {
    return NextResponse.json({ message: 'No user logged in' }, { status: 401 })
  }

  const requestBody = await req.json()

  const { intervals } = timeIntervalsBodySchema.parse(requestBody)

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return new NextResponse(undefined, { status: 201 })
}
