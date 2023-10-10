'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import ptBR from 'date-fns/locale/pt-BR'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays
      fromMonth={new Date()}
      className={cn('p-6', className)}
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
          'h-10 w-10 lg:text-base sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] p-0 aria-selected:opacity-100',
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50 pointer-events-none',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4 text-primary" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4 text-primary" />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }