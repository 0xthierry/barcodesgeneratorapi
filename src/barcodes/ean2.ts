import { IBarcode } from './IBarcode'

const START_DIGTS = '01011'
const SEPARATOR_DIGITS = '01'
const VALID_DATA_REGEX = /^[0-9]{2}$/gi

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

const PATTERNS = ['LL', 'LG', 'GL', 'GG'] as const

export class EAN2 implements IBarcode {
  constructor(private readonly data: string) {}

  valid() {
    return this.data.search(VALID_DATA_REGEX) !== -1
  }

  encode() {
    const patternIndex = Number(this.data) % 4
    const pattern = PATTERNS[patternIndex]
    const [leftPattern, rightPattern] = pattern.split('')
    const [leftDigit, rightDigit] = this.data.split('')
    // @ts-expect-error
    const rightValue = ENCONDINGS[rightPattern][rightDigit] as string
    // @ts-expect-error
    const leftValue = ENCONDINGS[leftPattern][leftDigit] as string

    return {
      data: `${START_DIGTS}${leftValue}${SEPARATOR_DIGITS}${rightValue}`,
    }
  }
}
