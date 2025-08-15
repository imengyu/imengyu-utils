/**
 * 防抖器类，用于限制函数在指定时间内的频繁调用
 */
export class Debounce {

  private timer = 0;
  private delay;
  private cb : () => void;

  /**
   * 创建Debounce实例
   * @param delay 防抖延迟时间(毫秒)
   * @param cb 要执行的回调函数
   */
  constructor(delay: number, cb: () => void) {
    this.cb = cb;
    this.delay = delay;
  }

  /**
   * 立即执行回调函数并启动防抖计时
   */
  execute() {
    if (this.timer > 0)
      return;
    this.timer = setTimeout(() => this.timer = 0, this.delay) as any as number;
    this.cb();
  }
  /**
   * 延迟执行回调函数并启动防抖计时
   * @param delay 可选的自定义延迟时间(毫秒)，默认使用构造函数中设置的delay
   */
  executeWithDelay(delay = -1) {
    if (this.timer > 0)
      return;
    if (delay <= 0)
      delay = this.delay;
    this.timer = setTimeout(() => {
      this.timer = 0;
      this.execute();
    }, delay) as any as number;
  }
}