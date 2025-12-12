/**
 * 节流器类，用于限制函数在指定时间内只能执行一次
 */
export class Throttle<P = any> {

  private timer = 0;
  private lastExecuteTime = 0;
  private delay;
  private cb: (params?: P) => void;

  /**
   * 创建Throttle实例
   * @param delay 节流时间间隔(毫秒)
   * @param cb 要执行的回调函数
   */
  constructor(delay: number, cb: (params?: P) => void) {
    this.cb = cb;
    this.delay = delay;
  }

  /**
   * 取消当前正在执行的回调函数
   */
  cancel() {
    if (this.timer > 0) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
  }

  /**
   * 尝试执行回调函数，如果距离上次执行时间超过节流间隔则执行
   */
  execute(params?: P) {
    const now = Date.now();
    const timeSinceLastExecute = now - this.lastExecuteTime;

    if (timeSinceLastExecute >= this.delay) {
      this.lastExecuteTime = now;
      this.cb(params);
    }
  }

  /**
   * 延迟执行回调函数，并启动节流计时
   * @param delay 可选的自定义延迟时间(毫秒)，默认使用构造函数中设置的delay
   */
  executeWithDelay(delay = -1, params?: P) {
    if (this.timer > 0) {
      return;
    }
    if (delay <= 0) {
      delay = this.delay;
    }
    this.timer = setTimeout(() => {
      this.timer = 0;
      this.execute(params);
    }, delay) as any as number;
  }
}