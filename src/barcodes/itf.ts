import { RegexError } from '../errors'
import { IBarcode } from './IBarcode'

const START_DIGTS = '1010'
const END_DIGITS = '1101'
const VALID_DATA_REGEX = /^[0-9]*/gi

const ENCONDING = [
  '00110',
  '10001',
  '01001',
  '11000',
  '00101',
  '10100',
  '01100',
  '00011',
  '10010 ',
  '01010',
] as const

// first pair is black bar 0=1 bar and 1=2 bar
// second pair is white bar 0=1 bar and 1=2 bar
// pair 03
// 0 = '00110' = 1111111
// 3 = '11000' = 0000000
// 03 = 10010011011010
// 6 = '01100' = 1111111
// 7 = '00011' = 0000000
// 67 = 10110110100100

export class ITF implements IBarcode {
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
    const { odd, even } = this.text.split('').reduce(
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
    this.data = `${this.data}${this.checkDigit ? checksum : ''}`
    this.data = this.data.length % 2 !== 0 ? `0${this.data}` : this.data
    const pairs = this.data.match(/(..?)/g) as string[]
    const barcode = pairs
      .map((pair) => {
        const [firstDigit, secondDigit] = pair.split('')
        const firstDigitEncondig = ENCONDING[Number(firstDigit)]
        const secondDigitEncondig = ENCONDING[Number(secondDigit)]

        return firstDigitEncondig
          .split('')
          .map((firstDigitBit, idx) => {
            const secondDigitBit = secondDigitEncondig[idx]
            const firstDigitBar = firstDigitBit === '1' ? '11' : '1'
            const secondDigitBar = secondDigitBit === '1' ? '00' : '0'
            return `${firstDigitBar}${secondDigitBar}`
          })
          .join('')
      })
      .join('')

    return {
      data: [START_DIGTS, barcode, END_DIGITS].join(''),
      text: this.text,
      checksum: checksum.toString(),
    }
  }
}
