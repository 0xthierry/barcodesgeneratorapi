import { ChecksumError, RegexError } from '../errors'
import { IBarcode } from './IBarcode'

const START_DIGTS = '101'
const END_DIGTS = '101'
const SEPARATOR_DIGITS = '01010'
const VALID_DATA_REGEX = /^[0-9]{7,8}$/gi

const ENCONDIG_TYPES = {
  L: 0,
  R: 1,
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
    '1110010',
    '1100110',
    '1101100',
    '1000010',
    '1011100',
    '1001110',
    '1010000',
    '1000100',
    '1001000',
    '1110100',
  ],
] as const

export class EAN8 implements IBarcode {
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

    if (this.text.length === 8 && this.text[8] !== this.checksum().toString()) {
      throw new ChecksumError()
    }
  }

  checksum() {
    const { odd, even } = this.data
      .slice(0, 7)
      .split('')
      .reverse()
      .reduce(
        (acc, n, idx) => {
          if (idx % 2 === 0) {
            return { ...acc, odd: acc.odd + Number(n) }
          } else {
            return { ...acc, even: acc.even + Number(n) }
          }
        },
        { odd: 0, even: 0 },
      )

    return (10 - ((3 * odd + even) % 10)) % 10
  }

  encode() {
    const checksum = this.checksum()
    this.data = `${this.data}${checksum}`

    const leftDigits = this.data
      .slice(0, 4)
      .split('')
      .map((n) => {
        const parsedNumber = Number(n)
        return ENCONDINGS[ENCONDIG_TYPES.L][parsedNumber]
      })
      .join('')
    const rightDigits = this.data
      .slice(4)
      .split('')
      .map((n) => {
        const parsedNumber = Number(n)
        return ENCONDINGS[ENCONDIG_TYPES.R][parsedNumber]
      })
      .join('')

    return {
      data: [
        START_DIGTS,
        leftDigits,
        SEPARATOR_DIGITS,
        rightDigits,
        END_DIGTS,
      ].join(''),
      text: this.text,
      checksum: checksum.toString(),
    }
  }
}
