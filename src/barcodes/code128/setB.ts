// space-del É-Ï - 32-127 & 201-207
const CHAR_SET_B = '[\x20-\x7f\xc9-\xcf]'

// https://www.codetable.net/unicodecharacters?page=1
export const getIndexBasedOnStringAndCharacterSetB = (str: string) => {
  // space - del
  if (str.match(/^[\x20-\x7f]+$/g) !== null) return str.charCodeAt(0) - 32
  if (str.match(/^[\xc9-\xcf]+$/g) !== null) return str.charCodeAt(0) - 105

  return null
}

export const getLongestMatchWithSetB = (substring: string): number => {
  return (substring.match(new RegExp(`^${CHAR_SET_B}*`)) as any[])[0].length
}
