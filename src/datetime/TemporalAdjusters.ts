import { DayOfWeek, TemporalAdjuster, daysInMonth } from './types';
import { LocalDate } from './LocalDate';

export const TemporalAdjusters = {
  firstDayOfMonth(): TemporalAdjuster {
    return (date: LocalDate) => date.withDayOfMonth(1);
  },

  lastDayOfMonth(): TemporalAdjuster {
    return (date: LocalDate) => date.withDayOfMonth(date.lengthOfMonth());
  },

  firstDayOfYear(): TemporalAdjuster {
    return (date: LocalDate) => LocalDate.of(date.year, 1, 1);
  },

  lastDayOfYear(): TemporalAdjuster {
    return (date: LocalDate) => LocalDate.of(date.year, 12, 31);
  },

  firstDayOfNextMonth(): TemporalAdjuster {
    return (date: LocalDate) => date.plusMonths(1).withDayOfMonth(1);
  },

  firstDayOfNextYear(): TemporalAdjuster {
    return (date: LocalDate) => LocalDate.of(date.year + 1, 1, 1);
  },

  dayOfWeekInMonth(ordinal: number, dayOfWeek: DayOfWeek): TemporalAdjuster {
    return (date: LocalDate) => {
      const first = date.withDayOfMonth(1);
      const firstDow = first.dayOfWeek;
      let diff = dayOfWeek - firstDow;
      if (diff < 0) diff += 7;
      const day = 1 + diff + (ordinal - 1) * 7;
      return LocalDate.of(date.year, date.month, day);
    };
  },

  next(dayOfWeek: DayOfWeek): TemporalAdjuster {
    return (date: LocalDate) => {
      const current = date.dayOfWeek;
      let daysToAdd = dayOfWeek - current;
      if (daysToAdd <= 0) daysToAdd += 7;
      return date.plusDays(daysToAdd);
    };
  },

  nextOrSame(dayOfWeek: DayOfWeek): TemporalAdjuster {
    return (date: LocalDate) => {
      if (date.dayOfWeek === dayOfWeek) return date;
      return TemporalAdjusters.next(dayOfWeek)(date);
    };
  },

  previous(dayOfWeek: DayOfWeek): TemporalAdjuster {
    return (date: LocalDate) => {
      const current = date.dayOfWeek;
      let daysToSubtract = current - dayOfWeek;
      if (daysToSubtract <= 0) daysToSubtract += 7;
      return date.minusDays(daysToSubtract);
    };
  },

  previousOrSame(dayOfWeek: DayOfWeek): TemporalAdjuster {
    return (date: LocalDate) => {
      if (date.dayOfWeek === dayOfWeek) return date;
      return TemporalAdjusters.previous(dayOfWeek)(date);
    };
  },
};
