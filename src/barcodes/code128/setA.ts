// null-_ É-Ï - 0-99 & 201-207
const CHAR_SET_A = '[\x00-\x5f\xc9-\xcf]'

// https://www.codetable.net/unicodecharacters?page=1
export const getIndexBasedOnStringAndCharacterSetA = (str: string) => {
  // space - _
  if (str.match(/^[\x20-\x5f]+$/g) !== null) return str.charCodeAt(0) - 32
  // null - US
  // eslint-disable-next-line no-control-regex
  if (str.match(/^[\x00-\x1f]+$/g) !== null) return str.charCodeAt(0) + 64
  // É - Ï
  if (str.match(/^[\xc9-\xcf]+$/g) !== null) return str.charCodeAt(0) - 105

  return null
}

export const getLongestMatchWithSetA = (substring: string): number => {
  return (substring.match(new RegExp(`^${CHAR_SET_A}*`)) as any[])[0].length
}
