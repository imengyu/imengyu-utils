/**
 * HTML工具类，提供HTML元素和DOM操作的常用方法
 */
export default {
  /**
   * 检查事件是否处于控件内（input\select）
   * @param e 事件
   */
  isEventInInputControl(e: Event): boolean {
    const target = e.target as HTMLElement;
    return target.tagName == "INPUT" || target.tagName == "SELECT";
  },
  getQueryVariable,
  isEleEditable,
  getTop,
  getLeft,
  getElementIndex,
  createElement,
  appendChildren,
  hasClass,
  addClass,
  removeClass,
  toggleClass,
  setStyle,
  getStyle,
  getTextContent,
  setTextContent,
  getInnerHTML,
  setInnerHTML,
  addEventListener,
  removeEventListener,
  triggerEvent,
  getBoundingClientRect,
  getComputedStyle,
  isElementInViewport,
  scrollToElement,
  getElements,
  getElement,
  findParent,
  findChildren,
  cloneElement,
  removeElement,
  disableElement,
  enableElement,
  isElementDisabled,
  setAttributes,
  getAttribute,
  removeAttribute,
  focusElement,
  blurElement,
  getFocusedElement,
  selectText,
  deselectText,
  getSelectionText,
  setSelectionRange,
  printSpecificElement,
};

/**
 * 判断点击区域可编辑
 * @param e 元素
 */
function isEleEditable(e: HTMLElement) : boolean {
  if (!e) return false;
  //为input标签或者contenteditable属性为true
  if (e.tagName == "INPUT" || e.contentEditable == "true") return true;
  //递归查询父节点
  else return isEleEditable(e.parentNode as HTMLElement);
}

/**
 * 获取URL参数
 * @param variable URL参数名称
 * @returns 
 */
function getQueryVariable(variable: string) : string|false {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 * 获取元素的绝对纵坐标
 * @param e 元素
 * @param stopClass 递归向上查找，遇到指定类的父级时停止
 */
function getTop(e: HTMLElement, stopClass ? : string) : number {
  let offset = e.offsetTop;
  if (e.offsetParent != null && (!stopClass || !(e.offsetParent as HTMLElement).classList.contains(stopClass)) )
    offset += getTop(e.offsetParent as HTMLElement, stopClass);
  return offset;
}

/**
 * 获取元素的绝对横坐标
 * @param e 元素
 * @param stopClass 递归向上查找，遇到指定类的父级时停止
 */
function getLeft(e: HTMLElement, stopClass ? : string) : number {
  let offset = e.offsetLeft;
  if (e.offsetParent != null && (!stopClass || !(e.offsetParent as HTMLElement).classList.contains(stopClass))) 
    offset += getLeft(e.offsetParent as HTMLElement, stopClass);
    
  return offset;
}

/**
 * 获取一个元素在它父元素的位置
 * @param element 元素
 * @returns 索引，如果没有，则返回-1
 */
function getElementIndex(element: HTMLElement) : number {
  for (let i = 0, c = (element.parentNode as HTMLElement).childNodes.length; i < c; i++)
    if ((element.parentNode as HTMLElement).childNodes.item(i) == element) return i;
  return -1;
}

/**
 * 创建HTML元素
 * @param tagName 元素标签名
 * @param attributes 元素属性对象
 * @param children 子元素数组
 * @returns 创建的元素
 */
function createElement(tagName: string, attributes?: Record<string, string>, children?: (HTMLElement|string)[]) : HTMLElement {
  const element = document.createElement(tagName);
  
  // 设置属性
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
  }
  
  // 添加子元素
  if (children) {
    for (const child of children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    }
  }
  
  return element;
}

/**
 * 向元素添加多个子元素
 * @param parent 父元素
 * @param children 子元素数组
 */
function appendChildren(parent: HTMLElement, children: (HTMLElement|string)[]) : void {
  for (const child of children) {
    if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else {
      parent.appendChild(child);
    }
  }
}

/**
 * 检查元素是否包含指定CSS类
 * @param element 元素
 * @param className CSS类名
 * @returns 是否包含
 */
function hasClass(element: HTMLElement, className: string) : boolean {
  return element.classList.contains(className);
}

/**
 * 向元素添加CSS类
 * @param element 元素
 * @param className CSS类名或类名数组
 */
function addClass(element: HTMLElement, className: string|string[]) : void {
  if (typeof className === 'string') {
    element.classList.add(className);
  } else {
    element.classList.add(...className);
  }
}

/**
 * 从元素移除CSS类
 * @param element 元素
 * @param className CSS类名或类名数组
 */
function removeClass(element: HTMLElement, className: string|string[]) : void {
  if (typeof className === 'string') {
    element.classList.remove(className);
  } else {
    element.classList.remove(...className);
  }
}

/**
 * 切换元素的CSS类
 * @param element 元素
 * @param className CSS类名
 * @param force 可选，强制添加或移除
 * @returns 切换后的状态
 */
function toggleClass(element: HTMLElement, className: string, force?: boolean) : boolean {
  return element.classList.toggle(className, force);
}

/**
 * 设置元素的CSS样式
 * @param element 元素
 * @param styles 样式对象
 */
function setStyle(element: HTMLElement, styles: Record<string, string|number>) : void {
  for (const [property, value] of Object.entries(styles)) {
    (element.style as any)[property] = value;
  }
}

/**
 * 获取元素的CSS样式值
 * @param element 元素
 * @param property 样式属性名
 * @returns 样式值
 */
function getStyle(element: HTMLElement, property: string) : string {
  return (element.style as any)[property];
}

/**
 * 获取元素的文本内容
 * @param element 元素
 * @returns 文本内容
 */
function getTextContent(element: HTMLElement) : string {
  return element.textContent || '';
}

/**
 * 设置元素的文本内容
 * @param element 元素
 * @param text 文本内容
 */
function setTextContent(element: HTMLElement, text: string) : void {
  element.textContent = text;
}

/**
 * 获取元素的innerHTML
 * @param element 元素
 * @returns HTML内容
 */
function getInnerHTML(element: HTMLElement) : string {
  return element.innerHTML;
}

/**
 * 设置元素的innerHTML
 * @param element 元素
 * @param html HTML内容
 */
function setInnerHTML(element: HTMLElement, html: string) : void {
  element.innerHTML = html;
}

/**
 * 为元素添加事件监听器
 * @param element 元素
 * @param event 事件名
 * @param handler 事件处理函数
 * @param options 事件选项
 */
function addEventListener(element: HTMLElement, event: string, handler: EventListenerOrEventListenerObject, options?: boolean|AddEventListenerOptions) : void {
  element.addEventListener(event, handler, options);
}

/**
 * 移除元素的事件监听器
 * @param element 元素
 * @param event 事件名
 * @param handler 事件处理函数
 * @param options 事件选项
 */
function removeEventListener(element: HTMLElement, event: string, handler: EventListenerOrEventListenerObject, options?: boolean|EventListenerOptions) : void {
  element.removeEventListener(event, handler, options);
}

/**
 * 触发元素的事件
 * @param element 元素
 * @param event 事件名
 * @param eventInit 事件初始化对象
 * @returns 事件是否被阻止
 */
function triggerEvent(element: HTMLElement, event: string, eventInit?: EventInit) : boolean {
  const customEvent = new Event(event, eventInit);
  return element.dispatchEvent(customEvent);
}

/**
 * 获取元素的位置和尺寸信息
 * @param element 元素
 * @returns 位置和尺寸信息对象
 */
function getBoundingClientRect(element: HTMLElement) : DOMRect {
  return element.getBoundingClientRect();
}

/**
 * 获取元素的计算样式
 * @param element 元素
 * @returns 计算样式对象
 */
function getComputedStyle(element: HTMLElement) : CSSStyleDeclaration {
  return window.getComputedStyle(element);
}

/**
 * 检查元素是否在视窗内
 * @param element 元素
 * @param partiallyVisible 是否部分可见即可
 * @returns 是否在视窗内
 */
function isElementInViewport(element: HTMLElement, partiallyVisible: boolean = false) : boolean {
  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
  
  if (partiallyVisible) {
    return (
      rect.top <= viewHeight &&
      rect.bottom >= 0 &&
      rect.left <= viewWidth &&
      rect.right >= 0
    );
  }
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewHeight &&
    rect.right <= viewWidth
  );
}

/**
 * 滚动到指定元素
 * @param element 元素
 * @param options 滚动选项
 */
function scrollToElement(element: HTMLElement, options?: ScrollIntoViewOptions) : void {
  element.scrollIntoView(options || { behavior: 'smooth', block: 'center' });
}

/**
 * 通过选择器获取多个元素
 * @param selector CSS选择器
 * @param context 上下文元素
 * @returns 元素数组
 */
function getElements<T extends Element = HTMLElement>(selector: string, context: Element = document as any) : T[] {
  return Array.from(context.querySelectorAll<T>(selector));
}

/**
 * 通过选择器获取单个元素
 * @param selector CSS选择器
 * @param context 上下文元素
 * @returns 元素或null
 */
function getElement<T extends Element = HTMLElement>(selector: string, context: Element = document as any) : T | null {
  return context.querySelector<T>(selector);
}

/**
 * 查找元素的父元素
 * @param element 元素
 * @param predicate 匹配条件函数
 * @param includeSelf 是否包含自身
 * @returns 匹配的父元素或null
 */
function findParent(element: HTMLElement, predicate: (el: HTMLElement) => boolean, includeSelf: boolean = false) : HTMLElement | null {
  if (includeSelf && predicate(element)) {
    return element;
  }
  
  let parent = element.parentElement;
  while (parent) {
    if (predicate(parent)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  
  return null;
}

/**
 * 查找元素的子元素
 * @param element 元素
 * @param predicate 匹配条件函数
 * @returns 匹配的子元素数组
 */
function findChildren(element: HTMLElement, predicate: (el: HTMLElement) => boolean) : HTMLElement[] {
  const results: HTMLElement[] = [];
  
  function traverse(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE && predicate(node as HTMLElement)) {
      results.push(node as HTMLElement);
    }
    
    let child = node.firstChild;
    while (child) {
      traverse(child);
      child = child.nextSibling;
    }
  }
  
  traverse(element);
  return results;
}

/**
 * 克隆元素
 * @param element 元素
 * @param deep 是否深度克隆
 * @returns 克隆的元素
 */
function cloneElement(element: HTMLElement, deep: boolean = true) : HTMLElement {
  return element.cloneNode(deep) as HTMLElement;
}

/**
 * 移除元素
 * @param element 元素
 */
function removeElement(element: HTMLElement) : void {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * 禁用元素
 * @param element 元素
 */
function disableElement(element: HTMLElement) : void {
  element.setAttribute('disabled', 'disabled');
}

/**
 * 启用元素
 * @param element 元素
 */
function enableElement(element: HTMLElement) : void {
  element.removeAttribute('disabled');
}

/**
 * 检查元素是否被禁用
 * @param element 元素
 * @returns 是否被禁用
 */
function isElementDisabled(element: HTMLElement) : boolean {
  return element.hasAttribute('disabled');
}

/**
 * 设置元素的多个属性
 * @param element 元素
 * @param attributes 属性对象
 */
function setAttributes(element: HTMLElement, attributes: Record<string, string>) : void {
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

/**
 * 获取元素的属性值
 * @param element 元素
 * @param attribute 属性名
 * @returns 属性值或null
 */
function getAttribute(element: HTMLElement, attribute: string) : string | null {
  return element.getAttribute(attribute);
}

/**
 * 移除元素的属性
 * @param element 元素
 * @param attribute 属性名
 */
function removeAttribute(element: HTMLElement, attribute: string) : void {
  element.removeAttribute(attribute);
}

/**
 * 使元素获得焦点
 * @param element 元素
 */
function focusElement(element: HTMLElement) : void {
  element.focus();
}

/**
 * 使元素失去焦点
 * @param element 元素
 */
function blurElement(element: HTMLElement) : void {
  element.blur();
}

/**
 * 获取当前获得焦点的元素
 * @returns 获得焦点的元素或null
 */
function getFocusedElement() : HTMLElement | null {
  const activeElement = document.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
}

/**
 * 选中文本输入框中的所有文本
 * @param element 文本输入元素
 */
function selectText(element: HTMLInputElement|HTMLTextAreaElement) : void {
  element.select();
}

/**
 * 取消文本选中状态
 */
function deselectText() : void {
  if (window.getSelection) {
    window.getSelection()?.removeAllRanges();
  } else if ((document as any).selection) {
    (document as any).selection.empty();
  }
}

/**
 * 获取当前选中的文本
 * @returns 选中的文本
 */
function getSelectionText() : string {
  if (window.getSelection) {
    return window.getSelection()?.toString() || '';
  } else if ((document as any).selection) {
    return (document as any).selection.createRange().text || '';
  }
  return '';
}

/**
 * 设置文本输入框的选择范围
 * @param element 文本输入元素
 * @param start 开始位置
 * @param end 结束位置
 */
function setSelectionRange(element: HTMLInputElement|HTMLTextAreaElement, start: number, end: number) : void {
  element.setSelectionRange(start, end);
}

function printSpecificElement(element: string, style?: string) {
    const targetElement = document.querySelector(element); // 获取要打印的元素
    if (!targetElement) {
        console.error('目标元素不存在');
        return;
    }
    const styles = document.createElement('style');
    styles.textContent = style || '';
    const newDoc = document.createElement('html');
    newDoc.innerHTML = `
        <head>${styles.outerHTML}</head>
        <body>${targetElement.outerHTML}</body>
    `;
    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(newDoc.outerHTML);
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
        console.error('无法打开新窗口');
        return;
    }
    newWindow.document.write(`
        <html>
            <head>
                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </head>
            <body>
                <iframe src="${dataUri}" style="width:100%;height:100%;border:0;"></iframe>
            </body>
        </html>
    `);
    newWindow.document.close();
}