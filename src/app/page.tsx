import { ClaimUsernameForm } from '@/components/claim-username-form'
import previewImage from '../assets/app-preview.png'
import stripesSvg from '../assets/stripes.svg'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="absolute -left-14 -z-10 flex h-full w-[1208px]">
        <Image src={stripesSvg} width={1208} height={682} alt="" />
      </div>

      <div className="flex flex-1 items-center justify-center gap-20 px-8">
        <div className="flex max-w-[400px] flex-col sm:max-w-md">
          <h1 className="text-5xl font-bold leading-tight sm:text-[64px]">
            Agendamento descomplicado
          </h1>
          <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </p>

          <ClaimUsernameForm />
        </div>

        <div className="hidden overflow-hidden lg:block">
          <Image
            src={previewImage}
            height={350}
            quality={100}
            priority
            alt="Calendário simbolizando aplicação em funcionamento."
          />
        </div>
      </div>
    </div>
  )
}
