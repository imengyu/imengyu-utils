import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TimeUtils from '../TimeUtils';

describe('TimeUtils', () => {
  describe('splitMillSeconds', () => {
    it('should split milliseconds into components', () => {
      const result = TimeUtils.splitMillSeconds(90061000);
      expect(result).toEqual({
        total: 90061000,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        milliseconds: 0,
      });
    });

    it('should handle zero', () => {
      const result = TimeUtils.splitMillSeconds(0);
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.milliseconds).toBe(0);
    });

    it('should preserve milliseconds remainder', () => {
      const result = TimeUtils.splitMillSeconds(1500);
      expect(result.seconds).toBe(1);
      expect(result.milliseconds).toBe(500);
    });
  });

  describe('secondToTimes', () => {
    it('should format seconds with auto collapse', () => {
      expect(TimeUtils.secondToTimes(90061)).toBe('1日1时1分1秒');
    });

    it('should omit zero units with auto collapse', () => {
      const result = TimeUtils.secondToTimes(3600);
      expect(result).toBe('1时0秒');
    });

    it('should show zero units without auto collapse', () => {
      const result = TimeUtils.secondToTimes(3600, false);
      expect(result).toBe('0日1时0分0秒');
    });

    it('should use custom lang strings', () => {
      const result = TimeUtils.secondToTimes(3661, true, {
        year: 'y', month: 'M', day: 'd', hour: 'h', minute: 'm', second: 's',
      });
      expect(result).toBe('1h1m1s');
    });
  });

  describe('millsecondToTimes', () => {
    it('should format milliseconds with auto collapse', () => {
      expect(TimeUtils.millsecondToTimes(90061000)).toBe('1日1时1分1秒');
    });

    it('should show zero units without auto collapse', () => {
      const result = TimeUtils.millsecondToTimes(60000, false);
      expect(result).toBe('0日0时1分0秒');
    });
  });

  describe('timeExpire', () => {
    it('should return true for past timestamp', () => {
      const now = new Date('2024-06-01T12:00:00');
      expect(TimeUtils.timeExpire(100, now)).toBe(true);
    });

    it('should return false for future timestamp', () => {
      const now = new Date('2024-06-01T12:00:00');
      expect(TimeUtils.timeExpire(9999999999999, now)).toBe(false);
    });

    it('should compare Date objects', () => {
      const now = new Date('2024-06-01T12:00:00');
      expect(TimeUtils.timeExpire(new Date('2024-05-01'), now)).toBe(true);
      expect(TimeUtils.timeExpire(new Date('2024-07-01'), now)).toBe(false);
    });
  });

  describe('getNowTimeString', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-01T14:30:45'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return 24h format without seconds', () => {
      expect(TimeUtils.getNowTimeString(true)).toBe('14:30');
    });

    it('should return 24h format with seconds', () => {
      expect(TimeUtils.getNowTimeString(true, true)).toBe('14:30:45');
    });

    it('should return 12h format without seconds', () => {
      expect(TimeUtils.getNowTimeString(false)).toBe('02:30pm');
    });

    it('should return 12h format with seconds', () => {
      expect(TimeUtils.getNowTimeString(false, true)).toBe('02:30:45pm');
    });
  });

  describe('getTimeStringSec', () => {
    it('should format seconds to MM:SS', () => {
      expect(TimeUtils.getTimeStringSec(90)).toBe('01:30');
    });

    it('should format with milliseconds', () => {
      expect(TimeUtils.getTimeStringSec(90.5, true)).toBe('01:30.500');
    });

    it('should handle zero', () => {
      expect(TimeUtils.getTimeStringSec(0)).toBe('00:00');
    });
  });

  describe('getTimeAgo', () => {
    it('should return secret time for null', () => {
      expect(TimeUtils.getTimeAgo(null as any)).toBe('神秘时间');
    });

    it('should return years ago', () => {
      const date = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 * 2);
      expect(TimeUtils.getTimeAgo(date)).toBe('2年前');
    });

    it('should return months ago', () => {
      const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 * 2);
      expect(TimeUtils.getTimeAgo(date)).toBe('2月前');
    });

    it('should return weeks ago', () => {
      const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 * 2);
      expect(TimeUtils.getTimeAgo(date)).toBe('2周前');
    });

    it('should return days ago', () => {
      const date = new Date(Date.now() - 24 * 60 * 60 * 1000 * 2);
      expect(TimeUtils.getTimeAgo(date)).toBe('2天前');
    });

    it('should return hours ago', () => {
      const date = new Date(Date.now() - 60 * 60 * 1000 * 3);
      expect(TimeUtils.getTimeAgo(date)).toBe('3小时前');
    });

    it('should return minutes ago', () => {
      const date = new Date(Date.now() - 60 * 1000 * 5);
      expect(TimeUtils.getTimeAgo(date)).toBe('5分钟前');
    });

    it('should return just now', () => {
      const date = new Date();
      expect(TimeUtils.getTimeAgo(date)).toBe('刚刚');
    });
  });

  describe('getTimeSurplus', () => {
    it('should return over time for past date', () => {
      const past = new Date(Date.now() - 10000);
      expect(TimeUtils.getTimeSurplus(past)).toBe('已经超过时间了');
    });

    it('should return days', () => {
      const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      expect(TimeUtils.getTimeSurplus(future)).toBe('2天');
    });

    it('should return hours', () => {
      const future = new Date(Date.now() + 3 * 60 * 60 * 1000);
      expect(TimeUtils.getTimeSurplus(future)).toBe('3小时');
    });

    it('should return minutes', () => {
      const future = new Date(Date.now() + 5 * 60 * 1000);
      expect(TimeUtils.getTimeSurplus(future)).toBe('5分钟');
    });

    it('should return seconds', () => {
      const future = new Date(Date.now() + 30 * 1000);
      expect(TimeUtils.getTimeSurplus(future)).toBe('30秒');
    });

    it('should use custom lang strings', () => {
      const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      const result = TimeUtils.getTimeSurplus(future, {
        second: 's', minute: 'm', hour: 'h', day: 'd', overTime: 'expired',
      });
      expect(result).toBe('2d');
    });
  });

  describe('getBetterDate', () => {
    it('should format same year same month today', () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const result = TimeUtils.getBetterDate(today);
      expect(result).toContain('今天');
    });
  });
});
