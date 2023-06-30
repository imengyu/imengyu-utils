export * from './PasswordTools';
export * from './ProfileCounter';
export * from './PyTools';

/**
 * setTimeout Promisify 等待延时
 */
export function waitTimeOut(timeOut: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeOut);
  });
}