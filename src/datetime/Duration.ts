import { LocalTime } from './LocalTime';
import { LocalDateTime } from './LocalDateTime';

export class Duration {
  private readonly _millis: number;

  private constructor(millis: number) {
    this._millis = millis;
  }

  static ofDays(days: number): Duration { return new Duration(days * 86400000); }
  static ofHours(hours: number): Duration { return new Duration(hours * 3600000); }
  static ofMinutes(minutes: number): Duration { return new Duration(minutes * 60000); }
  static ofSeconds(seconds: number): Duration { return new Duration(seconds * 1000); }
  static ofMillis(millis: number): Duration { return new Duration(millis); }

  static between(start: LocalTime | LocalDateTime, end: LocalTime | LocalDateTime): Duration {
    if (start instanceof LocalTime && end instanceof LocalTime) {
      return new Duration(end.toMillisOfDay() - start.toMillisOfDay());
    }
    const s = (start as LocalDateTime).toDate().getTime();
    const e = (end as LocalDateTime).toDate().getTime();
    return new Duration(e - s);
  }

  static parse(text: string): Duration {
    const m = text.match(/^-?PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/i);
    if (!m) throw new Error(`Cannot parse duration: ${text}`);
    const hours = m[1] ? parseInt(m[1]) : 0;
    const minutes = m[2] ? parseInt(m[2]) : 0;
    const seconds = m[3] ? parseFloat(m[3]) : 0;
    const total = hours * 3600000 + minutes * 60000 + seconds * 1000;
    return new Duration(text.startsWith('-') ? -total : total);
  }

  toDays(): number { return Math.trunc(this._millis / 86400000); }
  toHours(): number { return Math.trunc(this._millis / 3600000); }
  toMinutes(): number { return Math.trunc(this._millis / 60000); }
  toSeconds(): number { return Math.trunc(this._millis / 1000); }
  toMillis(): number { return this._millis; }

  plus(other: Duration): Duration { return new Duration(this._millis + other._millis); }
  minus(other: Duration): Duration { return new Duration(this._millis - other._millis); }
  multipliedBy(scalar: number): Duration { return new Duration(this._millis * scalar); }
  dividedBy(divisor: number): Duration { return new Duration(Math.trunc(this._millis / divisor)); }
  negated(): Duration { return new Duration(-this._millis); }
  abs(): Duration { return new Duration(Math.abs(this._millis)); }

  isZero(): boolean { return this._millis === 0; }
  isNegative(): boolean { return this._millis < 0; }

  compareTo(other: Duration): number {
    return this._millis < other._millis ? -1 : this._millis > other._millis ? 1 : 0;
  }

  toString(): string {
    if (this._millis === 0) return 'PT0S';
    const negative = this._millis < 0;
    let remaining = Math.abs(this._millis);
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); remaining %= 60000;
    const seconds = remaining / 1000;
    let result = negative ? '-PT' : 'PT';
    if (hours > 0) result += `${hours}H`;
    if (minutes > 0) result += `${minutes}M`;
    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      result += `${Number.isInteger(seconds) ? seconds : seconds.toFixed(3)}S`;
    }
    return result;
  }
}
