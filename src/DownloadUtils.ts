import { createObjectURL, revokeObjectURL } from "./FilePicker";

/**
 * 以指定的名称和内容下载文件
 * @param content 文件内容
 * @param fileName 文件名
 * @param mimeType 文件MIME类型
 */
function downloadFile(content: string | Blob | ArrayBuffer, fileName: string, mimeType: string): void {
  let blob: Blob;
  
  if (typeof content === 'string') {
    blob = new Blob([content], { type: mimeType });
  } else if (content instanceof ArrayBuffer) {
    blob = new Blob([content], { type: mimeType });
  } else {
    blob = content;
  }
  
  const url = createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
  setTimeout(() => revokeObjectURL(url), 100);
}

/**
 * 跨域下载URL文件
 * @param url 跨域URL
 * @param fileName 文件名
 */
async function downloadUrlCrossOrigin(url: string, fileName = '') {
  const res = await fetch(url);          // 如果需认证就加 {credentials:'include'}
  const blob = await res.blob();         // 转成 Blob
  const objURL = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objURL;
  a.download = fileName || url.split('/').pop() || '';
  a.click();

  URL.revokeObjectURL(objURL);           // 内存回收
}
/**
 * 直接下载同域（或 CORS 允许）文件，可自定义文件名
 * @param {string} url  文件地址
 * @param {string} fileName  另存为的名字
 */
function downloadURL(url: string, fileName = '') {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || url.split('/').pop() || ''; // 没传就用原文件名
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


export default { 
  downloadFile,
  downloadUrlCrossOrigin,
  downloadURL
};