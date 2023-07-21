import { ArrayUtils } from "..";

/**
 * 简易浏览器端使用的 EventEmitter
 */
export class EventEmitter {

  private listeners = new Map<string, Function[]>;

  /**
   * 监听事件
   * @param event 事件名称
   * @param cb 回调函数
   * @returns 
   */
  public on(event: string, cb: Function) : this {
    let array = this.listeners.get(event);
    if (!array) {
      array = [];
      this.listeners.set(event, array);
    }
    ArrayUtils.addOnce(array, cb);
    return this;
  }
  /**
   * 触发事件
   * @param event 事件名称
   * @param a 事件参数
   * @returns 
   */
  public emit(event: string, ...a: any[]) : this {
    const args = Array.prototype.slice.call(arguments);
    const array = this.listeners.get(event);
    args.shift();
    if (array) {
      array.forEach(cb => {
        cb.apply(null, args);
      });
    }
    return this;
  }
  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 监听器，如果为空，则移除全部监听器
   */
  public off(event: string, listener?: Function|undefined) {
    if (!listener) {
      this.clear(event);
      return;
    }
    const array = this.listeners.get(event);
    if (array)
      ArrayUtils.remove(array, listener);
  }
  /**
   * 监听一次事件
   * @param event 事件名
   * @param listener 监听器
   * @returns 
   */
  public once(event: string, listener: Function) : this {
    const self = this;

    function handler() {
      const args = Array.prototype.slice.call(arguments);
      listener.apply(null, args);
      self.off(event, handler);
    }

    this.on(event, handler);
    return this;
  }
  /**
   * 清除指定事件监听器
   * @param event 事件名
   */
  public clear(event: string) {
    this.listeners.delete(event);
  }
  /**
   * 获取事件监听器
   * @param event 
   * @returns 
   */
  public get(event: string) {
    return this.listeners.get(event);
  }
}
