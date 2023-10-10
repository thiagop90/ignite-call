import { MultiStep } from '@/components/multi-step'
import { ConnectCalendarContainer } from './_components/connect-calendar-container'

export default function ConnectCalendar() {
  return (
    <main className="mx-auto mt-20 flex max-w-xl flex-col gap-6 px-4">
      <div className="px-2">
        <h1 className="text-2xl font-bold leading-relaxed">
          Conecte sua agenda!
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </p>
      </div>

      <MultiStep className="px-2" size={4} currentStep={2} />

      <ConnectCalendarContainer />
    </main>
  )
}
