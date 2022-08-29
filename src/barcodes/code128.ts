/* eslint-disable no-control-regex */
import { RegexError } from '../errors'
import { IBarcode } from './IBarcode'

const START_DIGITS_BY_CODES = {
  A: '11010000100',
  B: '11010010000',
  C: '11010011100',
} as const
const START_DIGITS_BY_CHAR = {
  A: 'Ð',
  B: 'Ñ',
  C: 'Ò',
} as const

const STOP_DIGITS = '1100011101011'
const VALID_DATA_REGEX = /^[0-9]*/gi

const SWAP_BY_TYPE = {
  A: 101,
  B: 100,
  C: 99,
} as const
const SWAP_BY_CHAR = {
  A: 'Î',
  B: 'Í',
  C: 'Ì',
} as const
const SHIFT = 98
const SHIFT_CHAR = 'Ë'

const SWAP_BY_VALUE = {
  [SWAP_BY_TYPE.A]: 'A',
  [SWAP_BY_TYPE.B]: 'B',
  [SWAP_BY_TYPE.C]: 'C',
}

const BINARIES = [
  '11011001100',
  '11001101100',
  '11001100110',
  '10010011000',
  '10010001100',
  '10001001100',
  '10011001000',
  '10011000100',
  '10001100100',
  '11001001000',
  '11001000100',
  '11000100100',
  '10110011100',
  '10011011100',
  '10011001110',
  '10111001100',
  '10011101100',
  '10011100110',
  '11001110010',
  '11001011100',
  '11001001110',
  '11011100100',
  '11001110100',
  '11101101110',
  '11101001100',
  '11100101100',
  '11100100110',
  '11101100100',
  '11100110100',
  '11100110010',
  '11011011000',
  '11011000110',
  '11000110110',
  '10100011000',
  '10001011000',
  '10001000110',
  '10110001000',
  '10001101000',
  '10001100010',
  '11010001000',
  '11000101000',
  '11000100010',
  '10110111000',
  '10110001110',
  '10001101110',
  '10111011000',
  '10111000110',
  '10001110110',
  '11101110110',
  '11010001110',
  '11000101110',
  '11011101000',
  '11011100010',
  '11011101110',
  '11101011000',
  '11101000110',
  '11100010110',
  '11101101000',
  '11101100010',
  '11100011010',
  '11101111010',
  '11001000010',
  '11110001010',
  '10100110000',
  '10100001100',
  '10010110000',
  '10010000110',
  '10000101100',
  '10000100110',
  '10110010000',
  '10110000100',
  '10011010000',
  '10011000010',
  '10000110100',
  '10000110010',
  '11000010010',
  '11001010000',
  '11110111010',
  '11000010100',
  '10001111010',
  '10100111100',
  '10010111100',
  '10010011110',
  '10111100100',
  '10011110100',
  '10011110010',
  '11110100100',
  '11110010100',
  '11110010010',
  '11011011110',
  '11011110110',
  '11110110110',
  '10101111000',
  '10100011110',
  '10001011110',
  '10111101000',
  '10111100010',
  '11110101000',
  '11110100010',
  '10111011110',
  '10111101110',
  '11101011110',
  '11110101110',
  '11010000100',
  '11010010000',
  '11010011100',
  '1100011101011',
] as const

// https://courses.cs.washington.edu/courses/cse370/01au/minirproject/BarcodeBattlers/barcodes.html
// https://softmatic.com/barcode-code-128.html
// https://azaleabarcodes.com/faq/code-128/
// https://www.barcodefaq.com/1d/code-128/#CalculationExamples
// https://support.idautomation.com/Code-128/help-with-a-checksum-example/_1756
// https://honeywellsps.my.salesforce.com/sfc/p/#00000000SK3U/a/A00000000J9K/fZ9XdenyFImT6GKAicSkqOlgm76j4wto8iTx43qScAA
// https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html
// https://theasciicode.com.ar/ascii-control-characters/horizontal-tab-ascii-code-9.html
// https://www.rxkinetics.com/code128.html
// https://www.keyence.com/ss/products/auto_id/codereader/basic/code128.jsp

// \tHi\nHI
// CODE A = 11010000100
// \t = 10000110100
// H = 11000101000
// SHIFT B = 11110100010
// i = 10000110100
// \n = 10000110010
// H = 11000101000
// I 11000100010
// 11010000100100001101001100010100011110100010100001101001000011001011000101000110001000101100011101011

const getBinaryByIndex = (index: number) => BINARIES[index]

// https://www.codetable.net/unicodecharacters?page=1
// null-_ É-Ï - 0-99 & 201-207
const CHAR_SET_A = '[\x00-\x5f\xc9-\xcf]'
// space-del É-Ï - 32-127 & 201-207
const CHAR_SET_B = '[\x20-\x7f\xc9-\xcf]'
// 00-99 FNC1
const CHAR_SET_C = '(\xcf*[0-9]{2}\xcf*)'

// https://www.codetable.net/unicodecharacters?page=1
export const getIndexBasedOnStringAndCharacterSetA = (str: string) => {
  // space - _
  if (str.match(/^[\x20-\x5f]+$/g) !== null) return str.charCodeAt(0) - 32
  // null - US
  if (str.match(/^[\x00-\x1f]+$/g) !== null) return str.charCodeAt(0) + 64
  // É - Ï
  if (str.match(/^[\xc9-\xcf]+$/g) !== null) return str.charCodeAt(0) - 105

  return null
}

export const getIndexBasedOnStringAndCharacterSetB = (str: string) => {
  // space - del
  if (str.match(/^[\x20-\x7f]+$/g) !== null) return str.charCodeAt(0) - 32
  if (str.match(/^[\xc9-\xcf]+$/g) !== null) return str.charCodeAt(0) - 105

  return null
}

export const getIndexBasedOnStringAndCharacterSetC = (str: string) => {
  // Í-Ï
  if (str.match(/^[\xcd-\xcf]+$/g) !== null) return str.charCodeAt(0) - 105
  // \d
  if (str.match(/^\d+$/g) !== null) return Number(str)

  return null
}

const getIndexBasedOnStringAndCharacterSet = (str: string, set: string) => {
  switch (set) {
    case 'A':
      return getIndexBasedOnStringAndCharacterSetA(str)
    case 'B':
      return getIndexBasedOnStringAndCharacterSetB(str)
    case 'C':
      return getIndexBasedOnStringAndCharacterSetC(str)
    default:
      throw new Error('Invalid Set')
  }
}

const getLongestMatchWithSetA = (substring: string): number => {
  return (substring.match(new RegExp(`^${CHAR_SET_A}*`)) as any[])[0].length
}

const getLongestMatchWithSetB = (substring: string): number => {
  return (substring.match(new RegExp(`^${CHAR_SET_B}*`)) as any[])[0].length
}

/**
 * I need to think better about this algorithm
 * I should build something like this
 *  string
 *    Which is the best set to start?
 *      Within this set should I change the set?
 *        It should be code or shift?
 *          Where?
 *            Concatenate the equivalent char
 *
 * ex: \tHi\nHI then it should return Ð\tHËi\nHI
 *  SET_CHAR_A + \t + H + SHIFT B + i + \n + H + I
 */
/**
 *
 * @param value barcode data
 * @param set forced start set
 * @returns barcode data encoded with start set and shift/swap optmized
 */
export const prepareInput = (value: string, set?: 'A' | 'B' | 'C') => {
  const setChar =
    (set !== undefined && START_DIGITS_BY_CHAR[set]) || START_DIGITS_BY_CHAR.A

  let preparedInput = ''

  switch (setChar) {
    case START_DIGITS_BY_CHAR.A: {
      for (let index = 0; index < value.length; ) {
        const longestMatchA = getLongestMatchWithSetA(value.substring(index))
        if (longestMatchA === 0) {
          const longestMatchB = getLongestMatchWithSetB(value.substring(index))
          if (longestMatchB > 0) {
            if (longestMatchB > 1) {
              preparedInput = preparedInput.concat(
                String.fromCharCode(205),
                prepareInput(value.substring(index), 'B'),
              )
              index += longestMatchB
              break
            } else {
              preparedInput = preparedInput.concat(
                SHIFT_CHAR,
                value.substring(index, index + longestMatchB),
              )
              index += longestMatchB
            }
          }
        } else {
          preparedInput = preparedInput.concat(
            value.substring(index, index + longestMatchA),
          )
          index += longestMatchA
        }
      }
      break
    }
    case START_DIGITS_BY_CHAR.B: {
      for (let index = 0; index < value.length; ) {
        const longestMatchB = getLongestMatchWithSetB(value.substring(index))
        if (longestMatchB === 0) {
          const longestMatchA = getLongestMatchWithSetA(value.substring(index))
          if (longestMatchA > 0) {
            if (longestMatchA > 1) {
              preparedInput = preparedInput.concat(
                String.fromCharCode(206),
                prepareInput(value.substring(index), 'A'),
              )
              index += longestMatchA
              break
            } else {
              preparedInput = preparedInput.concat(
                SHIFT_CHAR,
                value.substring(index, index + longestMatchA),
              )
              index += longestMatchA
            }
          }
        } else {
          preparedInput = preparedInput.concat(
            value.substring(index, index + longestMatchB),
          )
          index += longestMatchB
        }
      }
      break
    }
    case START_DIGITS_BY_CHAR.C: {
      preparedInput = ''
      break
    }
    default: {
      throw new Error('Invalid Set')
    }
  }

  return preparedInput
}

/* const swapOrShift = (substring: string, set: string): number | null => {
  switch (set) {
    case 'A': {
      const totalOfMatchesSetA = getLongestMatchWithSetA(substring.substring(1))
      const totalOfMatchesSetB = getLongestMatchWithSetB(substring)

      if (totalOfMatchesSetA > totalOfMatchesSetB) return SHIFT
      if (totalOfMatchesSetB > totalOfMatchesSetA) return SWAP_BY_TYPE.B

      return null
    }
    case 'B': {
      const totalOfMatchesSetA = getLongestMatchWithSetA(substring)
      const totalOfMatchesSetB = getLongestMatchWithSetB(substring.substring(1))

      if (totalOfMatchesSetA > totalOfMatchesSetB) return SWAP_BY_TYPE.A
      if (totalOfMatchesSetB > totalOfMatchesSetA) return SHIFT

      return null
    }
    case 'C': {
      const totalOfMatchesSetA = getLongestMatchWithSetA(substring)
      const totalOfMatchesSetB = getLongestMatchWithSetB(substring)

      const isA = getIndexBasedOnStringAndCharacterSetA(substring[0])
      const isB = getIndexBasedOnStringAndCharacterSetB(substring[0])

      if (isA !== null && totalOfMatchesSetA >= totalOfMatchesSetB)
        return SWAP_BY_TYPE.A

      if (isB !== null && totalOfMatchesSetB >= totalOfMatchesSetA)
        return SWAP_BY_TYPE.B

      return null
    }
    default:
      throw new Error('Invalid Set')
  }
}
 */
export class CODE128 implements IBarcode {
  text: string
  data: string

  constructor(data: string, private readonly checkDigit: boolean = false) {
    this.text = data
    this.data = data
    this.validate()
  }

  validate() {
    const isRegexValid = this.text.search(VALID_DATA_REGEX) !== -1

    if (!isRegexValid) {
      throw new RegexError()
    }
  }

  checksum() {
    const sum = this.text.split('').reduce((acc, n, idx) => {
      const position = 0
      return acc + position * (idx + 1)
    }, 0)

    return sum % 103
  }

  encode() {
    const checksum = this.checksum()

    const checksumBarcode = BINARIES[checksum]
    const digits = this.text.split('').reduce((acc, n) => {
      const encondingIndex = 0
      const encode = BINARIES[encondingIndex]
      return acc.concat(encode)
    }, '')

    return {
      data: [
        START_DIGITS_BY_CODES.A,
        digits,
        checksumBarcode,
        STOP_DIGITS,
      ].join(''),
      text: this.text,
      checksum: checksum.toString(),
    }
  }
}
