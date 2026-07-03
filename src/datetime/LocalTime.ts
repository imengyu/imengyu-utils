export class LocalTime {
  private readonly _hour: number;
  private readonly _minute: number;
  private readonly _second: number;
  private readonly _millisecond: number;

  private constructor(hour: number, minute: number, second: number, millisecond: number) {
    this._hour = hour;
    this._minute = minute;
    this._second = second;
    this._millisecond = millisecond;
  }

  static of(hour: number, minute: number, second = 0, millisecond = 0): LocalTime {
    if (hour < 0 || hour > 23) throw new RangeError(`Invalid hour: ${hour}`);
    if (minute < 0 || minute > 59) throw new RangeError(`Invalid minute: ${minute}`);
    if (second < 0 || second > 59) throw new RangeError(`Invalid second: ${second}`);
    if (millisecond < 0 || millisecond > 999) throw new RangeError(`Invalid millisecond: ${millisecond}`);
    return new LocalTime(hour, minute, second, millisecond);
  }

  static now(): LocalTime {
    const d = new Date();
    return new LocalTime(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
  }

  static parse(text: string): LocalTime {
    const m = text.match(/^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/);
    if (!m) throw new Error(`Cannot parse time: ${text}`);
    return LocalTime.of(
      parseInt(m[1]),
      parseInt(m[2]),
      m[3] ? parseInt(m[3]) : 0,
      m[4] ? parseInt(m[4].padEnd(3, '0')) : 0
    );
  }

  static fromDate(date: Date): LocalTime {
    return new LocalTime(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  get hour(): number { return this._hour; }
  get minute(): number { return this._minute; }
  get second(): number { return this._second; }
  get millisecond(): number { return this._millisecond; }

  toMillisOfDay(): number {
    return this._hour * 3600000 + this._minute * 60000 + this._second * 1000 + this._millisecond;
  }

  private static fromMillisOfDay(millis: number): LocalTime {
    let ms = ((millis % 86400000) + 86400000) % 86400000;
    const h = Math.floor(ms / 3600000); ms -= h * 3600000;
    const m = Math.floor(ms / 60000); ms -= m * 60000;
    const s = Math.floor(ms / 1000); ms -= s * 1000;
    return new LocalTime(h, m, s, ms);
  }

  plusHours(hours: number): LocalTime {
    return LocalTime.fromMillisOfDay(this.toMillisOfDay() + hours * 3600000);
  }

  plusMinutes(minutes: number): LocalTime {
    return LocalTime.fromMillisOfDay(this.toMillisOfDay() + minutes * 60000);
  }

  plusSeconds(seconds: number): LocalTime {
    return LocalTime.fromMillisOfDay(this.toMillisOfDay() + seconds * 1000);
  }

  plusMilliseconds(ms: number): LocalTime {
    return LocalTime.fromMillisOfDay(this.toMillisOfDay() + ms);
  }

  minusHours(hours: number): LocalTime { return this.plusHours(-hours); }
  minusMinutes(minutes: number): LocalTime { return this.plusMinutes(-minutes); }
  minusSeconds(seconds: number): LocalTime { return this.plusSeconds(-seconds); }
  minusMilliseconds(ms: number): LocalTime { return this.plusMilliseconds(-ms); }

  withHour(hour: number): LocalTime { return LocalTime.of(hour, this._minute, this._second, this._millisecond); }
  withMinute(minute: number): LocalTime { return LocalTime.of(this._hour, minute, this._second, this._millisecond); }
  withSecond(second: number): LocalTime { return LocalTime.of(this._hour, this._minute, second, this._millisecond); }
  withMillisecond(ms: number): LocalTime { return LocalTime.of(this._hour, this._minute, this._second, ms); }

  isBefore(other: LocalTime): boolean { return this.compareTo(other) < 0; }
  isAfter(other: LocalTime): boolean { return this.compareTo(other) > 0; }
  isEqual(other: LocalTime): boolean { return this.compareTo(other) === 0; }

  compareTo(other: LocalTime): number {
    const a = this.toMillisOfDay();
    const b = other.toMillisOfDay();
    return a < b ? -1 : a > b ? 1 : 0;
  }

  toDate(): Date {
    const d = new Date();
    d.setHours(this._hour, this._minute, this._second, this._millisecond);
    return d;
  }

  toString(): string {
    const h = this._hour.toString().padStart(2, '0');
    const m = this._minute.toString().padStart(2, '0');
    const s = this._second.toString().padStart(2, '0');
    if (this._millisecond > 0) {
      return `${h}:${m}:${s}.${this._millisecond.toString().padStart(3, '0')}`;
    }
    return `${h}:${m}:${s}`;
  }
}
