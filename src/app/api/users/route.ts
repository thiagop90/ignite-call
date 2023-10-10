import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CookiesKeys } from '@/constants/cookies'

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { name, username } = data

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return NextResponse.json(
      { message: 'Nome de usuário já utilizado.' },
      { status: 400 },
    )
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  const response = NextResponse.json({ user })
  response.cookies.set({
    name: CookiesKeys.userId,
    value: user.id,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  return response
}
