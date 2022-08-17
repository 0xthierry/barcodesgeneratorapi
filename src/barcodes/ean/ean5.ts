import { IBarcode } from '../IBarcode'

const START_DIGTS = '01011'
const SEPARATOR_DIGITS = '01'
const VALID_DATA_REGEX = /^[0-9]{5}$/gi
const L_ENCONDING = {
  '0': '0001101',
  '1': '0011001',
  '2': '0010011',
  '3': '0111101',
  '4': '0100011',
  '5': '0110001',
  '6': '0101111',
  '7': '0111011',
  '8': '0110111',
  '9': '0001011',
} as const
const G_ENCONDING = {
  '0': '0100111',
  '1': '0110011',
  '2': '0011011',
  '3': '0100001',
  '4': '0011101',
  '5': '0111001',
  '6': '0000101',
  '7': '0010001',
  '8': '0001001',
  '9': '0010111',
} as const
const ENCONDINGS = {
  G: G_ENCONDING,
  L: L_ENCONDING,
} as const

const PATTERNS = [
  'GGLLL',
  'GLGLL',
  'GLLGL',
  'GLLLG',
  'LGGLL',
  'LLGGL',
  'LLLGG',
  'LGLGL',
  'LGLLG',
  'LLGLG',
] as const

export class EAN5 implements IBarcode {
  constructor(private readonly data: string) {}

  valid() {
    return this.data.search(VALID_DATA_REGEX) !== -1
  }

  encode() {
    const patternIndex =
      this.data.split('').reduce((acc, n, idx) => {
        return idx % 2 === 0 ? acc + Number(n) * 3 : acc + Number(n) * 9
      }, 0) % 10

    const pattern = PATTERNS[patternIndex]
    const digits = pattern.split('').map((p, idx) => {
      const currentDigit = this.data[idx]
      // @ts-expect-error
      return ENCONDINGS[p][currentDigit]
    })

    return {
      data: [
        START_DIGTS,
        digits[0],
        SEPARATOR_DIGITS,
        digits[1],
        SEPARATOR_DIGITS,
        digits[2],
        SEPARATOR_DIGITS,
        digits[3],
        SEPARATOR_DIGITS,
        digits[4],
      ].join(''),
    }
  }
}
