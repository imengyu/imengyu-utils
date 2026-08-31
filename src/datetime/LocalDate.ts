import { DayOfWeek, Month, TemporalAdjuster, daysInMonth, isLeapYear, jsDayToIsoDayOfWeek } from './types';
import { LocalDateTime } from './LocalDateTime';
import DateUtils from '../DateUtils';

export class LocalDate {
  private readonly _year: number;
  private readonly _month: number;
  private readonly _day: number;

  private constructor(year: number, month: number, day: number) {
    this._year = year;
    this._month = month;
    this._day = day;
  }

  static of(year: number, month: number, dayOfMonth: number): LocalDate {
    if (month < 1 || month > 12) throw new RangeError(`Invalid month: ${month}`);
    const maxDay = daysInMonth(year, month);
    if (dayOfMonth < 1 || dayOfMonth > maxDay) throw new RangeError(`Invalid day: ${dayOfMonth} for ${year}-${month}`);
    return new LocalDate(year, month, dayOfMonth);
  }

  static now(): LocalDate {
    const d = new Date();
    return new LocalDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  static parse(text: string): LocalDate {
    const m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) throw new Error(`Cannot parse date: ${text}`);
    return LocalDate.of(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
  }

  static fromDate(date: Date): LocalDate {
    return new LocalDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  get year(): number { return this._year; }
  get month(): number { return this._month; }
  get dayOfMonth(): number { return this._day; }

  get dayOfWeek(): DayOfWeek {
    return jsDayToIsoDayOfWeek(new Date(this._year, this._month - 1, this._day).getDay());
  }

  get dayOfYear(): number {
    let days = 0;
    for (let m = 1; m < this._month; m++) {
      days += daysInMonth(this._year, m);
    }
    return days + this._day;
  }

  plusDays(days: number): LocalDate {
    const d = new Date(this._year, this._month - 1, this._day + days);
    return LocalDate.fromDate(d);
  }

  plusWeeks(weeks: number): LocalDate {
    return this.plusDays(weeks * 7);
  }

  plusMonths(months: number): LocalDate {
    let totalMonths = this._year * 12 + (this._month - 1) + months;
    const newYear = Math.floor(totalMonths / 12);
    const newMonth = (totalMonths % 12) + 1;
    const maxDay = daysInMonth(newYear, newMonth);
    const newDay = Math.min(this._day, maxDay);
    return new LocalDate(newYear, newMonth, newDay);
  }

  plusYears(years: number): LocalDate {
    return this.plusMonths(years * 12);
  }

  minusDays(days: number): LocalDate { return this.plusDays(-days); }
  minusWeeks(weeks: number): LocalDate { return this.plusWeeks(-weeks); }
  minusMonths(months: number): LocalDate { return this.plusMonths(-months); }
  minusYears(years: number): LocalDate { return this.plusYears(-years); }

  withYear(year: number): LocalDate {
    const maxDay = daysInMonth(year, this._month);
    return new LocalDate(year, this._month, Math.min(this._day, maxDay));
  }

  withMonth(month: number): LocalDate {
    if (month < 1 || month > 12) throw new RangeError(`Invalid month: ${month}`);
    const maxDay = daysInMonth(this._year, month);
    return new LocalDate(this._year, month, Math.min(this._day, maxDay));
  }

  withDayOfMonth(day: number): LocalDate {
    return LocalDate.of(this._year, this._month, day);
  }

  with(adjuster: TemporalAdjuster): LocalDate {
    return adjuster(this);
  }

  isBefore(other: LocalDate): boolean { return this.compareTo(other) < 0; }
  isAfter(other: LocalDate): boolean { return this.compareTo(other) > 0; }
  isEqual(other: LocalDate): boolean { return this.compareTo(other) === 0; }

  compareTo(other: LocalDate): number {
    if (this._year !== other._year) return this._year < other._year ? -1 : 1;
    if (this._month !== other._month) return this._month < other._month ? -1 : 1;
    if (this._day !== other._day) return this._day < other._day ? -1 : 1;
    return 0;
  }

  isLeapYear(): boolean { return isLeapYear(this._year); }
  lengthOfMonth(): number { return daysInMonth(this._year, this._month); }
  lengthOfYear(): number { return this.isLeapYear() ? 366 : 365; }

  toDate(): Date {
    return new Date(this._year, this._month - 1, this._day);
  }

  toString(): string {
    const m = this._month.toString().padStart(2, '0');
    const d = this._day.toString().padStart(2, '0');
    return `${this._year}-${m}-${d}`;
  }

  format(pattern: string): string {
    return DateUtils.formatDate(this.toDate(), pattern);
  }

  toEpochDay(): number {
    return Math.floor(this.toDate().getTime() / 86400000);
  }

  atStartOfDay(): LocalDateTime {
    return LocalDateTime.of(this._year, this._month, this._day, 0, 0, 0, 0);
  }

  atTime(hour: number, minute: number, second = 0, millisecond = 0): LocalDateTime {
    return LocalDateTime.of(this._year, this._month, this._day, hour, minute, second, millisecond);
  }
}
