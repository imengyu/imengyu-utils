/**
 * 请求工具所使用的类定义
 *
 * Author: imengyu
 * Date: 2022/03/25
 *
 * Copyright (c) 2021 imengyu.top. Licensed under the MIT License.
 * See License.txt in the project root for license information.
 */

/**
 * 空的结构
 */
export type TypeEmpty = Record<string, never>;

/**
 * 可保存数据
 */
export type TypeSaveable =
  | TypeEmpty
  | string
  | number
  | null
  | undefined
  | bigint
  | boolean;
/**
 * 可保存数据
 */
export type TypeAll =
  | TypeEmpty
  | unknown
  | object
  | undefined
  | string
  | bigint
  | number
  | boolean;

/**
 * URL参数
 */
export interface QueryParams {
  /**
   * URL参数
   */
  [index: string]: TypeAll;
}

export interface HeaderType {
  [key: string]: string;
}
