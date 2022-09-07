// 00-99 FNC1
const CHAR_SET_C = '(\xcf*[0-9]{2}\xcf*)'

// https://www.codetable.net/unicodecharacters?page=1
export const getIndexBasedOnStringAndCharacterSetC = (str: string) => {
  // Í-Ï
  if (str.match(/^[\xcd-\xcf]+$/g) !== null) return str.charCodeAt(0) - 105
  // \d
  if (str.match(/^\d+$/g) !== null) return Number(str)

  return null
}

export const getLongestMatchWithSetC = (substring: string): number => {
  return (substring.match(new RegExp(`^${CHAR_SET_C}*`)) as any[])[0].length
}
