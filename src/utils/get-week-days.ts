import { format, setDay } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { capitalize } from './capitalize'

export function getWeekDays() {
  return Array.from(Array(7).keys()).map((weekDay) => {
    const formatted = format(setDay(new Date(), weekDay), 'EEEE', {
      locale: ptBR,
    })
    return capitalize(formatted)
  })
}
