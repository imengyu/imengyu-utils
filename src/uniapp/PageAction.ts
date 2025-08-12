import { type App } from "vue";

/**
 * 说明：页面导航相关函数封装。
 */

/**
 * 页面跳转: 后退至上一个页面。
 */
function back() {
  uni.navigateBack({ delta: 1 });
}
/**
 * 页面跳转: 后退并返回数据至上一个页面的 onPageBack 方法。
 * @param data 要返回的数据
 */
function backReturnData(data: Record<string, unknown>) {
  var pages = getCurrentPages(); // 获取页面栈
  var prevPage = pages[pages.length - 2] as { $vm: Record<string, unknown> }; // 上一个页面

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      prevPage.$vm[key] = data[key];
    }
  }

  uni.navigateBack({ delta: 1 });
}
/**
 * 页面跳转: 跳转到指定页面
 * @param url 页面路径
 * @param data 要传递的数据
 */
function navTo(url: string, data: Record<string, unknown> = {}) {
  var dataString = '';

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key))
      dataString += `&${key}=${data[key]}`;
  }

  uni.navigateTo({ 
    url: url + '?' + dataString,
    fail: (err) => {
      console.error('页面跳转失败:', err);
    },
  });
}
/**
 * 页面数据传递: 调用上一个页面的 onPageBack 方法
 * @param name 方法名
 * @param data 要传递的数据
 */
function callPrevOnPageBack(name: string, data: Record<string, unknown>) {
  var pages = getCurrentPages(); // 获取页面栈
  var prevPage = pages[pages.length - 2] as { $vm: Record<string, unknown> }; // 上一个页面

  if (typeof prevPage.$vm.onPageBack === 'function')
    prevPage.$vm.onPageBack(name, data);
}
/**
 * 页面跳转: 调用上一个页面的 onPageBack 方法并返回至上一个页面
 * @param name 方法名
 * @param data 要传递的数据
 */
function backAndCallOnPageBack(name: string, data: Record<string, unknown>) {
  var pages = getCurrentPages(); // 获取页面栈
  var prevPage = pages[pages.length - 2] as { $vm: Record<string, unknown> }; // 上一个页面

  if (typeof prevPage.$vm.onPageBack === 'function')
    prevPage.$vm.onPageBack(name, data);

  uni.navigateBack({ delta: 1 });
}

export {
  back,
  backReturnData,
  backAndCallOnPageBack, 
  navTo,
  callPrevOnPageBack,
}

export function getCurrentPageUrl() {
  const pages = getCurrentPages();
  const currentPagePath = pages[pages.length - 1]?.route
  return currentPagePath
}

export default {
  install(app: App<Element>) : void {
    app.config.globalProperties.$p = {
      back,
      backReturnData,
      backAndCallOnPageBack,
      callPrevOnPageBack,
      navTo,
    };
  },
}