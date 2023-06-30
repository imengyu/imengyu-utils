

/**
 * 将字符串转为16进制字符串
 * @param str 字符串
 */
function strToHexCharCode(str : string, with0x = true) : string {
  if(str === "")
    return "";
  const hexCharCode = [];
  if(with0x) 
    hexCharCode.push("0x"); 
  for(let i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");
}
/**
 * 获取字符串的哈希值
 * @param str 字符串
 * @param caseSensitive 是否大小写敏感
 * @return hashCode
 */
function getHashCode(str : string, caseSensitive: boolean) : string {
  if(!caseSensitive)
    str = str.toLowerCase();
  let hash = 1315423911, ch = 0;
  for (let i = str.length - 1; i >= 0; i--) {
      ch = str.charCodeAt(i);
      hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return strToHexCharCode((hash & 0x7FFFFFFF).toString(), false);
}

/**
 * 字符串转换相关工具类
 */
const StringConv = {
  strToHexCharCode,
  getHashCode,
};

export default StringConv;