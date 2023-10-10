import { authOptions } from '@/lib/auth/auth-options'
import { cookies } from 'next/headers'
import NextAuth from 'next-auth'

export async function GET(...args: unknown[]) {
  const cookiesStore = cookies()
  return NextAuth(authOptions(cookiesStore))(...args)
}

export async function POST(...args: unknown[]) {
  const cookiesStore = cookies()
  return NextAuth(authOptions(cookiesStore))(...args)
}
