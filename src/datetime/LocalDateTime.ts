import { DayOfWeek, TemporalAdjuster, daysInMonth, jsDayToIsoDayOfWeek } from './types';
import { LocalDate } from './LocalDate';
import { LocalTime } from './LocalTime';
import DateUtils from '../DateUtils';

export class LocalDateTime {
  private readonly _date: LocalDate;
  private readonly _time: LocalTime;

  private constructor(date: LocalDate, time: LocalTime) {
    this._date = date;
    this._time = time;
  }

  static of(year: number, month: number, day: number, hour = 0, minute = 0, second = 0, millisecond = 0): LocalDateTime {
    return new LocalDateTime(
      LocalDate.of(year, month, day),
      LocalTime.of(hour, minute, second, millisecond)
    );
  }

  static now(): LocalDateTime {
    const d = new Date();
    return new LocalDateTime(LocalDate.fromDate(d), LocalTime.fromDate(d));
  }

  static parse(text: string): LocalDateTime {
    const m = text.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?)$/);
    if (!m) throw new Error(`Cannot parse datetime: ${text}`);
    return new LocalDateTime(LocalDate.parse(m[1]), LocalTime.parse(m[2]));
  }

  static fromDate(date: Date): LocalDateTime {
    return new LocalDateTime(LocalDate.fromDate(date), LocalTime.fromDate(date));
  }

  static fromLocalDateAndTime(date: LocalDate, time: LocalTime): LocalDateTime {
    return new LocalDateTime(date, time);
  }

  get year(): number { return this._date.year; }
  get month(): number { return this._date.month; }
  get dayOfMonth(): number { return this._date.dayOfMonth; }
  get dayOfWeek(): DayOfWeek { return this._date.dayOfWeek; }
  get dayOfYear(): number { return this._date.dayOfYear; }
  get hour(): number { return this._time.hour; }
  get minute(): number { return this._time.minute; }
  get second(): number { return this._time.second; }
  get millisecond(): number { return this._time.millisecond; }

  plusYears(years: number): LocalDateTime {
    return new LocalDateTime(this._date.plusYears(years), this._time);
  }

  plusMonths(months: number): LocalDateTime {
    return new LocalDateTime(this._date.plusMonths(months), this._time);
  }

  plusWeeks(weeks: number): LocalDateTime {
    return new LocalDateTime(this._date.plusWeeks(weeks), this._time);
  }

  plusDays(days: number): LocalDateTime {
    return new LocalDateTime(this._date.plusDays(days), this._time);
  }

  plusHours(hours: number): LocalDateTime {
    const totalMs = this._time.toMillisOfDay() + hours * 3600000;
    const dayOverflow = Math.floor(totalMs / 86400000);
    const remainMs = ((totalMs % 86400000) + 86400000) % 86400000;
    const newDate = dayOverflow !== 0 ? this._date.plusDays(dayOverflow) : this._date;
    const h = Math.floor(remainMs / 3600000);
    const m = Math.floor((remainMs % 3600000) / 60000);
    const s = Math.floor((remainMs % 60000) / 1000);
    const ms = remainMs % 1000;
    return new LocalDateTime(newDate, LocalTime.of(h, m, s, ms));
  }

  plusMinutes(minutes: number): LocalDateTime {
    return this.plusHours(0).plusMillisInternal(minutes * 60000);
  }

  plusSeconds(seconds: number): LocalDateTime {
    return this.plusMillisInternal(seconds * 1000);
  }

  plusMilliseconds(ms: number): LocalDateTime {
    return this.plusMillisInternal(ms);
  }

  private plusMillisInternal(ms: number): LocalDateTime {
    const totalMs = this._time.toMillisOfDay() + ms;
    const dayOverflow = Math.floor(totalMs / 86400000);
    const remainMs = ((totalMs % 86400000) + 86400000) % 86400000;
    const newDate = dayOverflow !== 0 ? this._date.plusDays(dayOverflow) : this._date;
    const h = Math.floor(remainMs / 3600000);
    const min = Math.floor((remainMs % 3600000) / 60000);
    const s = Math.floor((remainMs % 60000) / 1000);
    const millis = remainMs % 1000;
    return new LocalDateTime(newDate, LocalTime.of(h, min, s, millis));
  }

  minusYears(years: number): LocalDateTime { return this.plusYears(-years); }
  minusMonths(months: number): LocalDateTime { return this.plusMonths(-months); }
  minusWeeks(weeks: number): LocalDateTime { return this.plusWeeks(-weeks); }
  minusDays(days: number): LocalDateTime { return this.plusDays(-days); }
  minusHours(hours: number): LocalDateTime { return this.plusHours(-hours); }
  minusMinutes(minutes: number): LocalDateTime { return this.plusMinutes(-minutes); }
  minusSeconds(seconds: number): LocalDateTime { return this.plusSeconds(-seconds); }
  minusMilliseconds(ms: number): LocalDateTime { return this.plusMilliseconds(-ms); }

  withYear(year: number): LocalDateTime { return new LocalDateTime(this._date.withYear(year), this._time); }
  withMonth(month: number): LocalDateTime { return new LocalDateTime(this._date.withMonth(month), this._time); }
  withDayOfMonth(day: number): LocalDateTime { return new LocalDateTime(this._date.withDayOfMonth(day), this._time); }
  withHour(hour: number): LocalDateTime { return new LocalDateTime(this._date, this._time.withHour(hour)); }
  withMinute(minute: number): LocalDateTime { return new LocalDateTime(this._date, this._time.withMinute(minute)); }
  withSecond(second: number): LocalDateTime { return new LocalDateTime(this._date, this._time.withSecond(second)); }
  withMillisecond(ms: number): LocalDateTime { return new LocalDateTime(this._date, this._time.withMillisecond(ms)); }

  with(adjuster: TemporalAdjuster): LocalDateTime {
    return new LocalDateTime(adjuster(this._date), this._time);
  }

  isBefore(other: LocalDateTime): boolean { return this.compareTo(other) < 0; }
  isAfter(other: LocalDateTime): boolean { return this.compareTo(other) > 0; }
  isEqual(other: LocalDateTime): boolean { return this.compareTo(other) === 0; }

  compareTo(other: LocalDateTime): number {
    const dc = this._date.compareTo(other._date);
    if (dc !== 0) return dc;
    return this._time.compareTo(other._time);
  }

  toLocalDate(): LocalDate { return this._date; }
  toLocalTime(): LocalTime { return this._time; }

  toDate(): Date {
    return new Date(this.year, this.month - 1, this.dayOfMonth, this.hour, this.minute, this.second, this.millisecond);
  }

  toString(): string {
    return `${this._date.toString()}T${this._time.toString()}`;
  }

  format(pattern: string): string {
    return DateUtils.formatDate(this.toDate(), pattern);
  }

  atStartOfDay(): LocalDateTime {
    return new LocalDateTime(this._date, LocalTime.of(0, 0, 0, 0));
  }

  atEndOfDay(): LocalDateTime {
    return new LocalDateTime(this._date, LocalTime.of(23, 59, 59, 999));
  }
}
