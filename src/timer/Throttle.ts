/**
 * 节流器类，用于限制函数在指定时间内只能执行一次
 */
export class Throttle<P = any> {

  private timer: ReturnType<typeof setTimeout> | 0 = 0;
  private lastExecuteTime = 0;
  private delay: number;
  private cb: (params?: P) => void;
  private leading: boolean;
  private trailing: boolean;
  private pendingParams: P | undefined;

  /**
   * 节流器选项
   */
  public static Options = {
    /** 立即执行，然后在指定时间内不再执行 */
    LEADING: { leading: true, trailing: false },
    /** 等待指定时间后执行，期间的调用会被忽略 */
    TRAILING: { leading: false, trailing: true },
    /** 立即执行，并且在指定时间后可以再次执行 */
    BOTH: { leading: true, trailing: true }
  };

  /**
   * 创建Throttle实例
   * @param delay 节流时间间隔(毫秒)
   * @param cb 要执行的回调函数
   * @param options 节流选项，控制执行模式
   */
  constructor(delay: number, cb: (params?: P) => void, options: { leading?: boolean, trailing?: boolean } = Throttle.Options.TRAILING) {
    if (typeof delay !== 'number' || delay <= 0) {
      throw new TypeError('Delay must be a positive number');
    }
    if (typeof cb !== 'function') {
      throw new TypeError('Callback must be a function');
    }
    
    this.cb = cb;
    this.delay = delay;
    this.leading = options.leading ?? false;
    this.trailing = options.trailing ?? true;
  }

  /**
   * 取消当前正在执行的回调函数
   */
  cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    this.pendingParams = undefined;
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
      this.pendingParams = undefined;
    } else if (this.trailing && !this.timer) {
      // 如果是trailing模式且没有定时器，则创建定时器
      this.pendingParams = params;
      this.timer = setTimeout(() => {
        this.timer = 0;
        this.lastExecuteTime = Date.now();
        this.cb(this.pendingParams);
        this.pendingParams = undefined;
      }, this.delay - timeSinceLastExecute);
    }
  }

  /**
   * 延迟执行回调函数，并启动节流计时
   * @param delay 可选的自定义延迟时间(毫秒)，默认使用构造函数中设置的delay
   */
  executeWithDelay(delay = -1, params?: P) {
    if (this.timer) {
      return;
    }
    
    const actualDelay = delay > 0 ? delay : this.delay;
    
    this.timer = setTimeout(() => {
      this.timer = 0;
      this.lastExecuteTime = Date.now();
      this.cb(params);
    }, actualDelay);
  }

  /**
   * 立即执行回调函数并重置计时
   */
  immediate(params?: P) {
    this.cancel();
    this.lastExecuteTime = Date.now();
    this.cb(params);
  }

  /**
   * 检查是否有等待执行的任务
   */
  isPending(): boolean {
    return !!this.timer;
  }

  /**
   * 获取距离下次允许执行的剩余时间(毫秒)
   */
  getRemainingTime(): number {
    const timeSinceLastExecute = Date.now() - this.lastExecuteTime;
    return Math.max(0, this.delay - timeSinceLastExecute);
  }

  /**
   * 销毁节流器，清理资源
   */
  destroy() {
    this.cancel();
  }
}