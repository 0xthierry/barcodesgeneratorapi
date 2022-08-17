import { IBarcode } from '../IBarcode'

const START_DIGTS = '101'
const END_DIGTS = '101'
const SEPARATOR_DIGITS = '01010'
const VALID_DATA_REGEX = /^[0-9]{7}$/gi

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
const R_ENCONDING = {
  '0': '1110010',
  '1': '1100110',
  '2': '1101100',
  '3': '1000010',
  '4': '1011100',
  '5': '1001110',
  '6': '1010000',
  '7': '1000100',
  '8': '1001000',
  '9': '1110100',
} as const
const ENCONDINGS = {
  L: L_ENCONDING,
  R: R_ENCONDING,
} as const

export class EAN8 implements IBarcode {
  constructor(private readonly data: string) {}

  valid() {
    return this.data.search(VALID_DATA_REGEX) !== -1
  }

  checksum() {
    const { odd, even } = this.data
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
    const dataWithChecksum = `${this.data}${checksum}`
    const leftDigits = dataWithChecksum
      .slice(0, 4)
      .split('')
      .map((n) => {
        // @ts-expect-error
        return ENCONDINGS.L[n]
      })
      .join('')
    const rightDigits = dataWithChecksum
      .slice(4)
      .split('')
      .map((n) => {
        // @ts-expect-error
        return ENCONDINGS.R[n]
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
    }
  }
}
