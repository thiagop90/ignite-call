import { authOptions } from '@/lib/auth/auth-options'
import { cookies } from 'next/headers'
import NextAuth from 'next-auth'

export async function GET(...args: any[]) {
  const cookiesStore = cookies()
  return NextAuth(authOptions(cookiesStore))(...args)
}

export async function POST(...args: any[]) {
  const cookiesStore = cookies()
  return NextAuth(authOptions(cookiesStore))(...args)
}
