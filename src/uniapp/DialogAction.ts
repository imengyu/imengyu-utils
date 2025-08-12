import { type App } from "vue";

/**
 * 说明：对话框相关的封装
 */

/**
 * 显示一个文本提示框
 * @param content - 要显示的提示内容
 */
function toast(content: string) {
  if (typeof content!=='string')
    content = '' + content;
  uni.showToast({
    title: content,
    icon: 'none',
  })
}
/**
 * 显示一个确认对话框
 * @param option - 对话框的配置选项
 * @param option.title - 对话框的标题，可选
 * @param option.content - 对话框的内容，可选
 */
function alert(option: {
  title?: string,
  content?: string,
}) {
  uni.showModal({
    title: option.title,
    content: option.content,
  })
};
/**
 * 显示一个确认对话框
 * @param option - 对话框的配置选项
 * @param option.title - 对话框的标题，可选
 * @param option.content - 对话框的内容，可选
 * @param option.cancelText - 取消按钮的文本，可选
 * @param option.confirmText - 确认按钮的文本，可选
 * @returns - 返回一个 Promise 对象，当用户点击确定按钮时，Promise 的结果为 true，否则为 false
 */
function confirm(option: {
  title?: string,
  content?: string,
  cancelText?: string, 
  confirmText?: string,
}) {
  return new Promise<boolean>((resolve, reject) => {
    uni.showModal({
      title: option.title || '',
      content: option.content || '',
      showCancel: true,
      cancelText: option.cancelText || '取消',
      confirmText: option.confirmText || '确定',
      success(res) {
        resolve(res.confirm);
      },
      fail(res) {
        reject(res);
      }
    })
  })
}

export {
  toast,
  alert,
  confirm, 
}

export default {
  install(app: App<Element>) : void {
    app.config.globalProperties.$toast = toast;
    app.config.globalProperties.$alert = alert;
    app.config.globalProperties.$confirm = confirm;
  },
}