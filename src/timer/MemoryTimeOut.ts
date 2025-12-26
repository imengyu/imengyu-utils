/**
 * MemoryTimeOut 工具类
 * 用于记录操作时间，判断是否超时，支持重置功能
 */

import SettingsUtils from "@/SettingsUtils";

export class MemoryTimeOut {
  private key: string;
  private timeout: number;

  /**
   * 构造函数
   * @param uniqueKey 唯一键名，用于区分不同的超时记录
   * @param timeout 超时时间（毫秒），默认3600000毫秒（1小时）
   */
  constructor(uniqueKey: string, timeout: number = 3600000) {
    this.key = `MemoryTimeOut_${uniqueKey}`;
    this.timeout = timeout; // 默认1小时
  }

  /**
   * 记录当前时间
   */
  public recordTime(): void {
    const timestamp = Date.now();
    SettingsUtils.setSettings(this.key, timestamp);
  }

  /**
   * 判断是否超时
   * @returns boolean 是否超时
   */
  public isTimeout(): boolean {
    const storedTime = SettingsUtils.getSettings(this.key, 0);
    if (!storedTime) {
      return true; // 没有记录时间，视为超时
    }
    return Date.now() - storedTime > this.timeout;
  }

  /**
   * 重置超时记录（清除存储的时间）
   */
  public reset(): void {
    SettingsUtils.removeSettings(this.key);
  }

  /**
   * 获取剩余时间（毫秒）
   * @returns number 剩余时间
   */
  public getRemainingTime(): number {
    const storedTime = SettingsUtils.getSettings(this.key, 0);
    if (!storedTime) {
      return 0;
    }
    const remaining = this.timeout - (Date.now() - storedTime);
    return Math.max(0, remaining);
  }

  /**
   * 获取已过时间（毫秒）
   * @returns number 已过时间
   */
  public getElapsedTime(): number {
    const storedTime = SettingsUtils.getSettings(this.key, 0);
    if (!storedTime) {
      return 0;
    }
    return Date.now() - storedTime;
  }
}

export default MemoryTimeOut;