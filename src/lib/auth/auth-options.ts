import type { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { PrismaAdapter } from './prisma-adapter'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const googleScopeEmail = 'https://www.googleapis.com/auth/userinfo.email'
const googleScopeProfile = 'https://www.googleapis.com/auth/userinfo.profile'
const googleScopeCalendar = 'https://www.googleapis.com/auth/calendar'

export function authOptions(cookies: ReadonlyRequestCookies): NextAuthOptions {
  return {
    adapter: PrismaAdapter(cookies),

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            scope: `${googleScopeEmail} ${googleScopeProfile} ${googleScopeCalendar}`,
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            username: '',
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],

    callbacks: {
      async signIn({ account }) {
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          return '/register/connect-calendar/?error=permissions'
        }

        return true
      },

      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}
