import { MultiStep } from '@/components/multi-step'
import { RegisterForm } from './_components/register-form'

export default function Register() {
  return (
    <main className="mx-auto mt-20 flex max-w-xl flex-col gap-6 px-4">
      <div className="px-2">
        <h1 className="text-2xl font-bold leading-relaxed">
          Bem-vindo ao Ignite Call!
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </p>
      </div>

      <MultiStep className="px-2" size={4} currentStep={1} />

      <RegisterForm />
    </main>
  )
}
