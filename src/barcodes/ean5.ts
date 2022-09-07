import { RegexError } from '../errors'
import { IBarcode } from './IBarcode'

const START_DIGTS = '01011'
const SEPARATOR_DIGITS = '01'
const VALID_DATA_REGEX = /^[0-9]{5}$/gi

const ENCONDIG_TYPES = {
  L: 0,
  G: 1,
} as const

const ENCONDINGS = [
  [
    '0001101',
    '0011001',
    '0010011',
    '0111101',
    '0100011',
    '0110001',
    '0101111',
    '0111011',
    '0110111',
    '0001011',
  ],
  [
    '0100111',
    '0110011',
    '0011011',
    '0100001',
    '0011101',
    '0111001',
    '0000101',
    '0010001',
    '0001001',
    '0010111',
  ],
]

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
  text: string
  data: string

  constructor(data: string) {
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

  encode() {
    const patternIndex =
      this.data.split('').reduce((acc, n, idx) => {
        return idx % 2 === 0 ? acc + Number(n) * 3 : acc + Number(n) * 9
      }, 0) % 10

    const digits = PATTERNS[patternIndex].split('').map((p, idx) => {
      const currentDigit = Number(this.data[idx])
      // @ts-expect-error
      return ENCONDINGS[ENCONDIG_TYPES[p]][currentDigit]
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
      text: this.text,
    }
  }
}
