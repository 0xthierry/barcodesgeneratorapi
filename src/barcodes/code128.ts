/* eslint-disable no-unreachable-loop */
/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-control-regex */
import { RegexError } from '../errors'
import { getBarcodeByIndex } from './code128/barcodes'
import {
  getIndexBasedOnStringAndCharacterSetA,
  getLongestMatchWithSetA,
} from './code128/setA'
import {
  getIndexBasedOnStringAndCharacterSetB,
  getLongestMatchWithSetB,
} from './code128/setB'
import {
  getIndexBasedOnStringAndCharacterSetC,
  getLongestMatchWithSetC,
} from './code128/setC'
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

const getIndexBasedOnStringAndCharacterSet = (str: string, set: string) => {
  if (set === 'A') {
    return getIndexBasedOnStringAndCharacterSetA(str)
  }
  if (set === 'B') {
    return getIndexBasedOnStringAndCharacterSetB(str)
  }
  if (set === 'C') {
    return getIndexBasedOnStringAndCharacterSetC(str)
  }
  throw new Error('Invalid Set')
}

const findBestStartSet = (value: string) => {
  const longestMatchA = getLongestMatchWithSetA(value)
  const longestMatchB = getLongestMatchWithSetB(value)
  const longestMatchC = getLongestMatchWithSetC(value)

  if (longestMatchC >= 4) {
    return START_DIGITS_BY_CHAR.C
  } else if (longestMatchA >= longestMatchB) {
    return START_DIGITS_BY_CHAR.A
  } else {
    return START_DIGITS_BY_CHAR.B
  }
}

const shouldSwapToCodeC = (value: string) => {
  const lengthOfC = getLongestMatchWithSetC(value)
  const isEndOfString = value.length === lengthOfC
  return lengthOfC >= 6 || (lengthOfC >= 4 && isEndOfString)
}

export const prepareInput = (originalString: string, set?: 'A' | 'B' | 'C') => {
  let currentCharSet =
    (set !== undefined && START_DIGITS_BY_CHAR[set]) ||
    findBestStartSet(originalString)

  const initialStartCode = currentCharSet
  let encodedString = ''
  let index = 0

  while (index < originalString.length) {
    const slicedOriginalString = originalString.substring(index)

    switch (currentCharSet) {
      case START_DIGITS_BY_CHAR.A: {
        if (shouldSwapToCodeC(slicedOriginalString)) {
          encodedString += SWAP_BY_CHAR.C
          currentCharSet = START_DIGITS_BY_CHAR.C
          continue
        }

        const char = originalString[index]

        if (getIndexBasedOnStringAndCharacterSetA(char) === null) {
          const longestMatchB = getLongestMatchWithSetB(
            originalString.substring(index),
          )

          if (longestMatchB >= 2) {
            encodedString += SWAP_BY_CHAR.B
            currentCharSet = START_DIGITS_BY_CHAR.B
          } else {
            encodedString += SHIFT_CHAR
            encodedString += char
            index++
          }
        } else {
          encodedString += char
          index++
        }
        break
      }
      case START_DIGITS_BY_CHAR.B: {
        if (shouldSwapToCodeC(slicedOriginalString)) {
          encodedString += SWAP_BY_CHAR.C
          currentCharSet = START_DIGITS_BY_CHAR.C
          continue
        }

        const char = originalString[index]

        if (getIndexBasedOnStringAndCharacterSetB(char) === null) {
          const longestMatchA = getLongestMatchWithSetA(
            originalString.substring(index),
          )

          if (longestMatchA >= 2) {
            encodedString += SWAP_BY_CHAR.A
            currentCharSet = START_DIGITS_BY_CHAR.A
          } else {
            encodedString += SHIFT_CHAR
            encodedString += char
            index++
          }
        } else {
          encodedString += char
          index++
        }
        break
      }
      case START_DIGITS_BY_CHAR.C: {
        const pairs = slicedOriginalString.match(/(..?)/gm) as []

        for (let pi = 0; pi < pairs.length; pi++) {
          const char = String(pairs[pi])

          if (getIndexBasedOnStringAndCharacterSetC(char) === null) {
            const longestMatchA = getLongestMatchWithSetA(slicedOriginalString)
            const longestMatchB = getLongestMatchWithSetB(slicedOriginalString)

            if (longestMatchA >= longestMatchB) {
              encodedString += SWAP_BY_CHAR.A
              currentCharSet = START_DIGITS_BY_CHAR.A
            } else {
              encodedString += SWAP_BY_CHAR.B
              currentCharSet = START_DIGITS_BY_CHAR.B
            }
            break
          } else {
            encodedString += char
            index += 2
          }
        }
        break
      }
      default: {
        throw new Error('Invalid Set')
      }
    }
  }

  return initialStartCode.concat(encodedString)
}

export const charsToBarcode = (value: string) => {
  let currentCharSet = ''
  let barcode = ''

  for (let index = 0; index < value.length; index++) {
    const char = value[index]

    if (char === START_DIGITS_BY_CHAR.A) {
      currentCharSet = 'A'
      barcode += START_DIGITS_BY_CODES.A
      continue
    } else if (char === START_DIGITS_BY_CHAR.B) {
      currentCharSet = 'B'
      barcode += START_DIGITS_BY_CODES.B
      continue
    } else if (char === START_DIGITS_BY_CHAR.C) {
      currentCharSet = 'C'
      barcode += START_DIGITS_BY_CODES.C
      continue
    } else if (char === SWAP_BY_CHAR.A) {
      currentCharSet = 'A'
      barcode += getBarcodeByIndex(SWAP_BY_TYPE.A)
      continue
    } else if (char === SWAP_BY_CHAR.B) {
      currentCharSet = 'B'
      barcode += getBarcodeByIndex(SWAP_BY_TYPE.B)
      continue
    } else if (char === SWAP_BY_CHAR.C) {
      currentCharSet = 'C'
      barcode += getBarcodeByIndex(SWAP_BY_TYPE.C)
      continue
    } else if (char === SHIFT_CHAR) {
      const barcodeIdx = getIndexBasedOnStringAndCharacterSet(
        value[++index],
        currentCharSet === 'A' ? 'B' : 'A',
      ) as number
      barcode += getBarcodeByIndex(SHIFT)
      barcode += getBarcodeByIndex(barcodeIdx)
      continue
    }

    const pValue =
      currentCharSet === 'C'
        ? (value.substring(index).match(/(..?)/gm) as any[])[0] || value[index]
        : value[index]

    const barcodeIdx = getIndexBasedOnStringAndCharacterSet(
      pValue,
      currentCharSet,
    ) as number

    barcode += getBarcodeByIndex(barcodeIdx)

    if (currentCharSet === 'C') {
      index++
    }
  }

  return barcode
}

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
