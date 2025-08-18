import { onLoad } from "@dcloudio/uni-app";
import { nextTick, ref, type Ref } from "vue";

/**
 * 用于在页面加载时获取并处理页面参数的组合式函数。
 * @param defaults - 页面参数的默认值对象，其类型为泛型 T，T 需继承自 Record<string, any>。
 * @param afterLoad - 可选的回调函数，在页面加载完成且参数处理完毕后执行，接收处理后的参数对象作为参数。
 */
export function useLoadQuerys<T extends Record<string, any>>(
  defaults: T, 
  afterLoad?: (querys: T) => void
) {
  const querys = ref<T>(defaults) as Ref<T>; 

  onLoad((_querys) => {
    if (_querys) {
      for (const key in querys.value) {
        if (typeof defaults[key] === 'boolean')
          (querys.value as Record<string, any>)[key] = _querys[key] !== 'false'; 
        else if (typeof defaults[key] === 'number')
          (querys.value as Record<string, any>)[key] = _querys[key] ? Number(_querys[key]) : defaults[key]; 
        else
          querys.value[key] = _querys[key] ?? defaults[key];
      }
    }
    nextTick(() => {
      afterLoad?.(querys.value);
    });
  });

  return {
    querys,
  }
}

export function stringDotNumbersToNumbers(a: number|number[]|string|undefined): number|number[]|undefined {
  if (typeof a === 'string') {
    if (a.includes(','))
      return a.split(',').map(stringDotNumbersToNumbers) as number[]; 
    else
      return Number(a.replace(/\./g, '')); 
  }
  return a;
}