import { MultiStep } from '@/components/multi-step'
import { UpdateProfileForm } from './_components/update-profile-form'

export default function UpdateProfile() {
  return (
    <main className="mx-auto mt-20 flex max-w-xl flex-col gap-6 px-4">
      <div className="px-2">
        <h1 className="text-2xl font-bold leading-relaxed">
          Complete o seu perfil
        </h1>
        <p className="leading-relaxed text-muted-foreground">
          Por último, uma breve descrição e uma foto de perfil.
        </p>
      </div>

      <MultiStep className="px-2" size={4} currentStep={4} />

      <UpdateProfileForm />
    </main>
  )
}
