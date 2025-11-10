/**
 * 文件选择工具类
 * 提供文件选择、预览、读取等功能
 */

/**
 * 选择Excel文件的MIME类型
 */
export const PICK_EXCEL_FILE_MIME = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * 选择Word文件的MIME类型
 */
export const PICK_WORD_FILE_MIME = 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * 选择PDF文件的MIME类型
 */
export const PICK_PDF_FILE_MIME = 'application/pdf';

/**
 * 选择图片文件的MIME类型
 */
export const PICK_IMAGE_FILE_MIME = 'image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml';

/**
 * 选择音频文件的MIME类型
 */
export const PICK_AUDIO_FILE_MIME = 'audio/mpeg,audio/ogg,audio/wav,audio/flac,audio/aac';

/**
 * 选择视频文件的MIME类型
 */
export const PICK_VIDEO_FILE_MIME = 'video/mp4,video/webm,video/ogg,video/avi,video/mov';

/**
 * 选择文本文件的MIME类型
 */
export const PICK_TEXT_FILE_MIME = 'text/plain,text/html,text/css,text/javascript,application/json,application/xml';

/**
 * 基础文件选择函数
 * @param accept 可接受的MIME类型，与 input=file 的 accept 一致
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickFile(accept: string, multiple: boolean, cb: (files: FileList) => void) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('style', 'opacity:0;height:0;position:absolute;z-index:-1;');
  input.setAttribute('accept', accept);
  if (multiple) {
    input.setAttribute('multiple', 'true');
  }
  document.body.appendChild(input);

  input.addEventListener('change', () => {
    if (input.files && input.files.length > 0) {
      cb(input.files);
    } else {
      // 回调仍然执行，传入空的FileList
      cb(input.files || new FileList() as any);
    }
    // 确保在下次选择前移除元素
    setTimeout(() => {
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    }, 0);
  });
  
  // 触发文件选择对话框
  input.click();
}

/**
 * 选择Excel文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickExcelFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_EXCEL_FILE_MIME, multiple, cb);
}

/**
 * 选择Word文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickWordFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_WORD_FILE_MIME, multiple, cb);
}

/**
 * 选择PDF文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickPdfFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_PDF_FILE_MIME, multiple, cb);
}

/**
 * 选择图片文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickImageFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_IMAGE_FILE_MIME, multiple, cb);
}

/**
 * 选择音频文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickAudioFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_AUDIO_FILE_MIME, multiple, cb);
}

/**
 * 选择视频文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickVideoFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_VIDEO_FILE_MIME, multiple, cb);
}

/**
 * 选择文本文件
 * @param multiple 是否允许多选
 * @param cb 选择文件回调
 */
export function pickTextFile(multiple: boolean, cb: (files: FileList) => void) {
  pickFile(PICK_TEXT_FILE_MIME, multiple, cb);
}

/**
 * 获取文件扩展名（小写）
 * @param fileName 文件名
 * @returns 文件扩展名，不含点
 */
export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return '';
  }
  return fileName.substring(lastDotIndex + 1).toLowerCase();
}

/**
 * 读取文件内容为DataURL
 * @param file 要读取的文件
 * @returns Promise<DataURL字符串>
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as DataURL'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

/**
 * 读取文件内容为文本
 * @param file 要读取的文件
 * @param encoding 文件编码，默认为utf-8
 * @returns Promise<文本内容>
 */
export function readFileAsText(file: File, encoding: string = 'utf-8'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file, encoding);
  });
}

/**
 * 读取文件内容为ArrayBuffer
 * @param file 要读取的文件
 * @returns Promise<ArrayBuffer>
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 创建文件预览URL
 * @param file 要预览的文件
 * @returns 预览URL
 */
export function createObjectURL(file: File | Blob): string {
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    return URL.createObjectURL(file);
  }
  throw new Error('URL.createObjectURL is not supported in this environment');
}

/**
 * 释放预览URL资源
 * @param url 预览URL
 */
export function revokeObjectURL(url: string): void {
  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url);
  }
}

/**
 * 检查文件是否为图片类型
 * @param file 文件对象
 * @returns 是否为图片
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 检查文件是否为音频类型
 * @param file 文件对象
 * @returns 是否为音频
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * 检查文件是否为视频类型
 * @param file 文件对象
 * @returns 是否为视频
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * 检查文件是否为文本类型
 * @param file 文件对象
 * @returns 是否为文本
 */
export function isTextFile(file: File): boolean {
  return file.type.startsWith('text/') || 
         file.type === 'application/json' || 
         file.type === 'application/xml';
}

/**
 * 过滤文件列表，仅保留指定类型的文件
 * @param files 文件列表
 * @param filterFunc 过滤函数
 * @returns 过滤后的文件数组
 */
export function filterFiles(files: FileList, filterFunc: (file: File) => boolean): File[] {
  const result: File[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (filterFunc(file)) {
      result.push(file);
    }
  }
  return result;
}

