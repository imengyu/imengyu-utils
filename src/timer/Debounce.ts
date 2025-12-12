/**
 * 防抖器类，用于限制函数在指定时间内的频繁调用
 */
export class Debounce<P = any> {

  private timer: ReturnType<typeof setTimeout> | 0 = 0;
  private delay: number;
  private cb: (params?: P) => void;
  private leading: boolean;
  private trailing: boolean;
  private pendingParams: P | undefined;
  private updateParams: boolean;

  /**
   * 防抖器选项
   */
  public static Options = {
    /** 立即执行，然后在指定时间内的调用会重置计时但不执行 */
    LEADING: { leading: true, trailing: false, updateParams: false },
    /** 等待指定时间后执行，期间的调用会重置计时 */
    TRAILING: { leading: false, trailing: true, updateParams: true },
    /** 立即执行，并且在指定时间内的调用会重置计时 */
    BOTH: { leading: true, trailing: true, updateParams: false }
  };

  /**
   * 创建Debounce实例
   * @param delay 防抖延迟时间(毫秒)
   * @param cb 要执行的回调函数
   * @param options 防抖选项，控制执行模式
   */
  constructor(delay: number, cb: (params?: P) => void, options: { leading?: boolean, trailing?: boolean, updateParams?: boolean } = Debounce.Options.TRAILING) {
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
    this.updateParams = options.updateParams ?? true;
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
   * 执行回调函数并启动防抖计时
   */
  execute(params?: P) {
    // 更新待执行的参数（如果允许）
    if (this.updateParams) {
      this.pendingParams = params;
    }

    // 如果已经有定时器，重置它
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }

    // 如果是leading模式，立即执行
    if (this.leading) {
      this.cb(this.pendingParams);
      this.pendingParams = undefined;
    }

    // 设置新的定时器
    this.timer = setTimeout(() => {
      this.timer = 0;
      if (this.trailing && this.pendingParams !== undefined) {
        this.cb(this.pendingParams);
        this.pendingParams = undefined;
      }
    }, this.delay);
  }

  /**
   * 延迟执行回调函数并启动防抖计时
   * @param delay 可选的自定义延迟时间(毫秒)，默认使用构造函数中设置的delay
   */
  executeWithDelay(delay = -1, params?: P) {
    // 更新待执行的参数（如果允许）
    if (this.updateParams) {
      this.pendingParams = params;
    }

    // 如果已经有定时器，重置它
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }

    // 使用指定的延迟或默认延迟
    const actualDelay = delay > 0 ? delay : this.delay;

    // 设置新的定时器
    this.timer = setTimeout(() => {
      this.timer = 0;
      this.cb(this.pendingParams);
      this.pendingParams = undefined;
    }, actualDelay);
  }

  /**
   * 立即执行回调函数并重置计时
   */
  immediate(params?: P) {
    this.cancel();
    this.cb(params);
  }

  /**
   * 检查是否有等待执行的任务
   */
  isPending(): boolean {
    return !!this.timer;
  }

  /**
   * 获取距离下次执行的剩余时间(毫秒)
   */
  getRemainingTime(): number {
    // 由于防抖器的特性，剩余时间就是当前设置的延迟
    // 但实际上如果有定时器在运行，剩余时间应该是动态的
    // 这里为了简化实现，返回当前延迟
    return this.delay;
  }

  /**
   * 销毁防抖器，清理资源
   */
  destroy() {
    this.cancel();
  }
}