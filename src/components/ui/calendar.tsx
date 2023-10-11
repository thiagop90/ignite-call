'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import ptBR from 'date-fns/locale/pt-BR'

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  blockedDates?: Date[] | undefined
}

function Calendar({
  className,
  classNames,
  blockedDates,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays
      fromMonth={new Date()}
      className={cn('py-6 sm:px-4', className)}
      classNames={{
        months: 'flex flex-col',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'capitalize font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(buttonVariants({ variant: 'outline' }), 'h-9 w-9 p-0'),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex mt-2',
        head_cell:
          'text-muted-foreground flex-1 font-medium text-[0.8rem] uppercase',
        row: 'flex w-full mt-2 space-x-1',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-12 w-12 lg:text-sm sm:w-14 sm:h-14 p-0 aria-selected:opacity-100',
          {
            'animate-pulse bg-accent text-transparent pointer-events-none':
              !blockedDates,
          },
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: cn(
          'before:absolute before:bottom-2 before:w-1 before:h-1 before:rounded-full before:bg-accent-foreground aria-selected:before:bg-primary-foreground',
          {
            'before:hidden': !blockedDates,
          },
        ),
        day_outside: cn(
          'text-muted-foreground opacity-50 pointer-events-none',
          { 'opacity-100': !blockedDates },
        ),
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4 text-primary" />,
        IconRight: () => <ChevronRight className="h-4 w-4 text-primary" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
