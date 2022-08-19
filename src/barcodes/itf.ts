import { IBarcode } from './IBarcode'

const START_DIGTS = '1010'
const END_DIGITS = '1101'
const VALID_DATA_REGEX = /^[0-9]$/gi

const ENCONDING = {
  '0': '00110',
  '1': '10001',
  '2': '01001',
  '3': '11000',
  '4': '00101',
  '5': '10100',
  '6': '01100',
  '7': '00011',
  '8': '10010 ',
  '9': '01010',
} as const

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
  constructor(
    protected readonly data: string,
    private readonly checkDigit: boolean = false,
  ) {}

  valid() {
    return this.data.search(VALID_DATA_REGEX) !== -1
  }

  checksum() {
    const { odd, even } = this.data.split('').reduce(
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
    // it should be optional
    const dataWithChecksum = `${this.data}${
      this.checkDigit ? this.checksum() : ''
    }`

    const evenData =
      dataWithChecksum.length % 2 !== 0
        ? `0${dataWithChecksum}`
        : dataWithChecksum

    if (evenData.match(/(..?)/g) === null) {
      throw new Error('Invalid')
    }
    const pairs = evenData.match(/(..?)/g) as string[]
    const barcode = pairs
      .map((pair) => {
        const [firstDigit, secondDigit] = pair.split('')
        // @ts-expect-error
        const firstDigitEncondig = ENCONDING[firstDigit] as string
        // @ts-expect-error
        const secondDigitEncondig = ENCONDING[secondDigit] as string

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
    }
  }
}
