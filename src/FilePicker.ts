/**
 * 选择Excel文件的mime类型
 */
export const PICK_EXCEL_FILE_MIME = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * 选择文件
 * @param accept 可接受的mime类型，与 input=file 的 accept 一致。
 * @param cb 选择文件回调
 */
export function pickFile(accept: string, multiple: boolean, cb: (files: FileList) => void) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('style', 'opacity:0;height:0;');
  input.setAttribute('accept', accept);
  if (multiple)
    input.setAttribute('multiple', 'true');
  document.body.appendChild(input);

  input.addEventListener('change', () => {
    if (input.files && input.files.length > 0) {
      cb(input.files);
    }
    document.body.removeChild(input);
  });
  input.click();
}