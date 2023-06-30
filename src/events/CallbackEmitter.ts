/**
 * 事件回调存储类
 */

import ArrayUtils from "@/ArrayUtils";

// eslint-disable-next-line @typescript-eslint/ban-types
export class CallbackEmitter<T extends Function> {
  private callbacks : Array<T> = [];
  
  /**
   * 获取当前回调数量
   * @returns 
   */
  public count() : number {
    return this.callbacks.length;
  }
  /**
   * 添加回调
   * @param callback 
   */
  public add(callback : T) : void {
    this.callbacks.push(callback);
  }
  /**
   * 移除回调
   * @param callback 
   */
  public remove(callback : T) : void {
    ArrayUtils.remove(this.callbacks, callback);
  }
  /**
   * 清空回调
   */
  public clear() : void {
    ArrayUtils.clear(this.callbacks);
  }
  /**
   * 发出事件
   * @param args 参数
   */
  public emitAll(thisArg: unknown, ...args: unknown[]) : void {
    this.callbacks.forEach((k) => {
      k.call(thisArg, args);
    });
  }
  /**
   * 发出事件
   * @param args 参数
   */
  public emit<U>(callback: (curr: T) => U) : U[] {
    const ret = new Array<U>();   
    this.callbacks.forEach((k) => ret.push(callback(k)));
    return ret;
  }
}