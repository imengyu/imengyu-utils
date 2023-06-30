export interface PySegSortItem {
  letter: string;
  data: string[];
}

/**
 * 汉字按拼音首字母分组拼序
 * @param arr
 * @returns
 */
export function pySegSort(arr: string[]) : PySegSortItem[] {
  if (!String.prototype.localeCompare)
    throw new Error("Not found localeCompare! ");

  const letters = "*abcdefghjklmnopqrstwxyz".split('');
  const zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');

  const segs = [] as PySegSortItem[];
  let curr : PySegSortItem|null = null;
  letters.forEach(function(item,i){
    curr = { letter: item, data:[] };
    arr.forEach(function(item2){
      if ((!zh[i - 1] || zh[i - 1].localeCompare(item2) <= 0) && item2.localeCompare(zh[i]) === -1) {
        curr?.data.push(item2);
      }
    });
    if (curr.data.length) {
      segs.push(curr);
      curr.data.sort(function(a,b){
        return a.localeCompare(b);
      });
    }
  });
  return segs;
}