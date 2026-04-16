import { ArrayUtils } from "..";

/**
 * 事件表：事件名对应监听器函数签名。
 * 监听器参数即为 {@link EventEmitter.emit} / {@link EventEmitter.emitAsync} 传入的参数。
 */
export type EventEmitterEventMap = Record<string, (...args: any[]) => any>;

type Listener = (...args: any[]) => any;

/**
 * 由「事件名 -> 参数元组」映射生成 {@link EventEmitter} 所需的函数签名映射。
 *
 * @example
 * type Args = { data: [string, number]; done: [] };
 * const emitter = new EventEmitter<EventEmitterFromTuple<Args>>();
 */
export type EventEmitterFromTuple<T extends Record<string, unknown[]>> = {
  [K in keyof T]: T[K] extends unknown[] ? (...args: T[K]) => void : never;
};

/**
 * 简易浏览器端使用的 EventEmitter
 *
 * @typeParam M 事件映射；省略时与任意 `string` 事件名、`any[]` 参数兼容。
 */
export class EventEmitter<M extends EventEmitterEventMap = EventEmitterEventMap> {

  private listeners = new Map<string, Listener[]>;
  private anyHandler : ((event: string, args: any[]) => any) |null = null;

  /**
   * 监听事件
   * @param event 事件名称
   * @param cb 回调函数
   * @returns
   */
  public on<K extends keyof M>(event: K, cb: M[K]) : this {
    const key = event as string;
    let array = this.listeners.get(key);
    if (!array)
      array = [];
    ArrayUtils.addOnce(array, cb as Listener);
    this.listeners.set(key, array);
    return this;
  }
  /**
   * 监听全部事件。
   * 此回调只能设置一个，设置后，其他通过 on 函数设置的监听器无效。
   * @returns
   */
  public any(cb: (event: string, args: any[]) => any) : this {
    this.anyHandler = cb;
    return this;
  }
  /**
   * 触发事件
   * @param event 事件名称
   * @param a 事件参数
   * @returns
   */
  public emit<K extends keyof M>(event: K, ...a: Parameters<M[K]>) : this {
    const args = Array.prototype.slice.call(arguments);

    if (this.anyHandler) {
      this.anyHandler(event as string, args);
      return this;
    }

    const array = this.listeners.get(event as string);
    args.shift();
    if (array) {
      array.forEach(cb => {
        cb.apply(null, args);
      });
    }
    return this;
  }
  /**
   * 触发异步事件，并获取返回值
   * @param event 事件名称
   * @param a 事件参数
   * @returns 如果有多个事件监听器，则返回包含所有事件监听器返回值的数组。如果只有一个事件监听器，返回此监听器返回值。
   */
  public async emitAsync<K extends keyof M>(event: K, ...a: Parameters<M[K]>) : Promise<any> {
    const args = Array.prototype.slice.call(arguments);

    if (this.anyHandler)
      return await this.anyHandler(event as string, args);

    const array = this.listeners.get(event as string);
    args.shift();
    if (array) {
      let result : any[] = [];
      for (const cb of array)
        result.push(await cb.apply(null, args));
      return result.length === 1 ? result[0] : result;
    }
    return undefined;
  }
  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 监听器，如果为空，则移除全部监听器
   */
  public off<K extends keyof M>(event: K, listener?: M[K]|undefined) {
    if (!listener) {
      this.clear(event);
      return;
    }
    const array = this.listeners.get(event as string);
    if (array)
      ArrayUtils.remove(array, listener as Listener);
  }
  /**
   * 监听一次事件
   * @param event 事件名
   * @param listener 监听器
   * @returns
   */
  public once<K extends keyof M>(event: K, listener: M[K]) : this {
    const self = this;

    function handler() {
      const args = Array.prototype.slice.call(arguments);
      (listener as Listener).apply(null, args);
      self.off(event, handler as unknown as M[K]);
    }

    this.on(event, handler as unknown as M[K]);
    return this;
  }
  /**
   * 清除指定事件监听器
   * @param event 事件名
   */
  public clear<K extends keyof M>(event: K) {
    this.listeners.delete(event as string);
  }
  /**
   * 获取事件监听器
   * @param event
   * @returns
   */
  public get<K extends keyof M>(event: K) {
    return this.listeners.get(event as string);
  }
}
