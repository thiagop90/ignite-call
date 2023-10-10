import { MultiStep } from '@/components/multi-step'
import { TimeIntervalsForm } from './_components/time-intervals-form'

export default function TimeIntervals() {
  return (
    <main className="mx-auto mt-20 flex max-w-xl flex-col gap-6 px-4">
      <div className="px-2">
        <h1 className="text-2xl font-bold leading-relaxed">Quase lá</h1>
        <p className="leading-relaxed text-muted-foreground">
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </p>
      </div>

      <MultiStep className="px-2" size={4} currentStep={3} />

      <TimeIntervalsForm />
    </main>
  )
}
