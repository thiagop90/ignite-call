'use client'

import { ArrowRight, Check } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function ConnectCalendarContainer() {
  const session = useSession()
  const query = useSearchParams()
  const router = useRouter()

  const isSignedIn = session.status === 'authenticated'
  const error = query.get('error')

  async function handleConnect() {
    await signIn('google')
  }

  function handleNextStep() {
    router.push('/register/time-intervals')
  }

  return (
    <div className="flex flex-col rounded-md border bg-card p-4">
      <div className="mb-4 flex items-center justify-between rounded-md border px-5 py-4">
        <span>Google Calendar</span>
        {isSignedIn ? (
          <Button size="sm" variant="secondary" disabled>
            Conectado
            <Check className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleConnect}>
            Conectar
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!!error && (
        <span className="mb-4 text-destructive">
          Falha ao se conectar ao Google, verifique se você habilitou as
          permissões de acesso ao Google Calendar.
        </span>
      )}

      <Button onClick={handleNextStep} type="submit" disabled={!isSignedIn}>
        Próximo passo
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
