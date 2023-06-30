/**
 * 检查密码的强度等级
 * @param pwd 密码
 * @returns 0：表示第一个级别 1：表示第二个级别 2：表示第三个级别 3：表示第四个级别 4：表示第五个级别
 */
export function checkPassWordSecrityLevel(pwd: string) : number{
  let score = 0;
  if (!pwd) {
    return score;
  }
  // award every unique letter until 5 repetitions
  const letters = {} as Record<string, number>;
  for (let i = 0; i< pwd.length; i++) {
    letters[pwd[i]] = (letters[pwd[i]] || 0) + 1;
    score += 5.0 / letters[pwd[i]];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pwd),
    lower: /[a-z]/.test(pwd),
    upper: /[A-Z]/.test(pwd),
    nonWords: /\W/.test(pwd),
  } as Record<string, boolean>;

  let variationCount = 0;
  for (const check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return Math.floor(score);
}