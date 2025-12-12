/**
 * 防抖器类，用于限制函数在指定时间内的频繁调用
 */
export class Debounce<P = any> {

  private timer = 0;
  private delay;
  private cb : (params?: P) => void;

  /**
   * 创建Debounce实例
   * @param delay 防抖延迟时间(毫秒)
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
   * 立即执行回调函数并启动防抖计时
   */
  execute(params?: P) {
    if (this.timer > 0)
      return;
    this.timer = setTimeout(() => this.timer = 0, this.delay) as any as number;
    this.cb(params);
  }
  /**
   * 延迟执行回调函数并启动防抖计时
   * @param delay 可选的自定义延迟时间(毫秒)，默认使用构造函数中设置的delay
   */
  executeWithDelay(delay = -1, params?: P) {
    if (this.timer > 0)
      return;
    if (delay <= 0)
      delay = this.delay;
    this.timer = setTimeout(() => {
      this.timer = 0;
      this.execute(params);
    }, delay) as any as number;
  }
}