import { HTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

export interface MultiStepProps extends HTMLAttributes<HTMLDivElement> {
  size: number
  currentStep: number
}

type MultiStep = HTMLDivElement

const MultiStep = forwardRef<MultiStep, MultiStepProps>((props, ref) => {
  const { className, currentStep, size, ...rest } = props

  return (
    <div ref={ref} className={cn('', className)} {...rest}>
      <span className="text-sm">
        Passo {currentStep} de {size}
      </span>
      <div
        className={`mt-2 grid grid-cols-[repeat(auto-fit,_minmax(0,1fr))] gap-2`}
      >
        {Array.from({ length: size }, (_, i) => i + 1).map((step) => {
          return (
            <div
              key={step}
              className={cn('h-1 rounded-full bg-secondary', {
                'bg-gray-100': step <= currentStep,
              })}
            />
          )
        })}
      </div>
    </div>
  )
})
MultiStep.displayName = 'MultiStep'

export { MultiStep }
