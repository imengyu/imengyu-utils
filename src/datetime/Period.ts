import { LocalDate } from './LocalDate';
import { daysInMonth } from './types';

export class Period {
  private readonly _years: number;
  private readonly _months: number;
  private readonly _days: number;

  private constructor(years: number, months: number, days: number) {
    this._years = years;
    this._months = months;
    this._days = days;
  }

  static of(years: number, months: number, days: number): Period {
    return new Period(years, months, days);
  }

  static ofYears(years: number): Period { return new Period(years, 0, 0); }
  static ofMonths(months: number): Period { return new Period(0, months, 0); }
  static ofDays(days: number): Period { return new Period(0, 0, days); }

  static between(startInclusive: LocalDate, endExclusive: LocalDate): Period {
    let years = endExclusive.year - startInclusive.year;
    let months = endExclusive.month - startInclusive.month;
    let days = endExclusive.dayOfMonth - startInclusive.dayOfMonth;

    if (days < 0) {
      months--;
      const prevMonth = endExclusive.month - 1 === 0 ? 12 : endExclusive.month - 1;
      const prevYear = endExclusive.month - 1 === 0 ? endExclusive.year - 1 : endExclusive.year;
      days += daysInMonth(prevYear, prevMonth);
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return new Period(years, months, days);
  }

  static parse(text: string): Period {
    const m = text.match(/^-?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?$/i);
    if (!m) throw new Error(`Cannot parse period: ${text}`);
    const years = m[1] ? parseInt(m[1]) : 0;
    const months = m[2] ? parseInt(m[2]) : 0;
    const days = m[3] ? parseInt(m[3]) : 0;
    const neg = text.startsWith('-');
    return new Period(neg ? -years : years, neg ? -months : months, neg ? -days : days);
  }

  get years(): number { return this._years; }
  get months(): number { return this._months; }
  get days(): number { return this._days; }
  get totalMonths(): number { return this._years * 12 + this._months; }

  plus(other: Period): Period {
    return new Period(this._years + other._years, this._months + other._months, this._days + other._days);
  }

  minus(other: Period): Period {
    return new Period(this._years - other._years, this._months - other._months, this._days - other._days);
  }

  multipliedBy(scalar: number): Period {
    return new Period(this._years * scalar, this._months * scalar, this._days * scalar);
  }

  negated(): Period {
    return new Period(-this._years, -this._months, -this._days);
  }

  normalized(): Period {
    const totalMonths = this._years * 12 + this._months;
    const years = Math.trunc(totalMonths / 12);
    const months = totalMonths % 12;
    return new Period(years, months, this._days);
  }

  isZero(): boolean {
    return this._years === 0 && this._months === 0 && this._days === 0;
  }

  isNegative(): boolean {
    return this._years < 0 || this._months < 0 || this._days < 0;
  }

  toString(): string {
    if (this.isZero()) return 'P0D';
    let result = 'P';
    if (this._years !== 0) result += `${this._years}Y`;
    if (this._months !== 0) result += `${this._months}M`;
    if (this._days !== 0) result += `${this._days}D`;
    return result;
  }
}
