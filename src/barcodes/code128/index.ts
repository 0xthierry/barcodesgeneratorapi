/**
 * https://courses.cs.washington.edu/courses/cse370/01au/minirproject/BarcodeBattlers/barcodes.html
 * https://softmatic.com/barcode-code-128.html
 * https://azaleabarcodes.com/faq/code-128/
 * https://www.barcodefaq.com/1d/code-128/#CalculationExamples
 * https://support.idautomation.com/Code-128/help-with-a-checksum-example/_1756
 * https://honeywellsps.my.salesforce.com/sfc/p/#00000000SK3U/a/A00000000J9K/fZ9XdenyFImT6GKAicSkqOlgm76j4wto8iTx43qScAA
 * https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html
 * https://theasciicode.com.ar/ascii-control-characters/horizontal-tab-ascii-code-9.html
 * https://www.rxkinetics.com/code128.html
 * https://www.keyence.com/ss/products/auto_id/codereader/basic/code128.jsp
 */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-unreachable */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-control-regex */
import { RegexError } from '../../errors'
import { getBarcodeByIndex } from './barcodes'
import {
  getIndexBasedOnStringAndCharacterSetA,
  getLongestMatchWithSetA,
} from './setA'
import {
  getIndexBasedOnStringAndCharacterSetB,
  getLongestMatchWithSetB,
} from './setB'
import {
  getIndexBasedOnStringAndCharacterSetC,
  getLongestMatchWithSetC,
} from './setC'
import { IBarcode } from '../IBarcode'

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
const VALID_DATA_REGEX = /^[\x00-\x7e]*/gi

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

  constructor(data: string, private readonly set?: 'A' | 'B' | 'C') {
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

  /**
   * 42184020500
   * START C - 105 - 1 - 1
   * 42 - 42 - 2 - 2
   * 18 - 18 - 3
   * 40 - 40 - 4
   * 20 - 20 - 5
   * 50 - 50 - 6
   * CODE A - 101 - 7
   * 0 - 16 - 8
   */
  checksum() {
    let currentCharSet = ''
    let sum = 0

    if (this.data[0] === START_DIGITS_BY_CHAR.A) {
      currentCharSet = 'A'
      sum += 103
    } else if (this.data[0] === START_DIGITS_BY_CHAR.B) {
      currentCharSet = 'B'
      sum += 104
    } else if (this.data[0] === START_DIGITS_BY_CHAR.C) {
      currentCharSet = 'C'
      sum += 105
    }

    const substring = this.data.substring(1)

    for (
      let index = 0, realIndex = 0;
      index < substring.length;
      index++, realIndex++
    ) {
      const char = substring[index]

      if (char === SWAP_BY_CHAR.A) {
        currentCharSet = 'A'
        sum += SWAP_BY_TYPE.A * (realIndex + 1)
        continue
      } else if (char === SWAP_BY_CHAR.B) {
        currentCharSet = 'B'
        sum += SWAP_BY_TYPE.B * (realIndex + 1)
        continue
      } else if (char === SWAP_BY_CHAR.C) {
        currentCharSet = 'C'
        sum += SWAP_BY_TYPE.C * (realIndex + 1)
        continue
      } else if (char === SHIFT_CHAR) {
        sum += SHIFT * (realIndex + 1)
        const barcodeIdx = getIndexBasedOnStringAndCharacterSet(
          substring[++index],
          currentCharSet === 'A' ? 'B' : 'A',
        ) as number
        sum += barcodeIdx * (++realIndex + 1)
        continue
      }

      const pValue =
        currentCharSet === 'C'
          ? (substring.substring(index).match(/(..?)/gm) as any[])[0] ||
            substring[index]
          : substring[index]

      const barcodeIdx = getIndexBasedOnStringAndCharacterSet(
        pValue,
        currentCharSet,
      ) as number

      sum += barcodeIdx * (realIndex + 1)

      if (currentCharSet === 'C') {
        index++
      }
    }

    return sum % 103
  }

  encode() {
    this.data = prepareInput(this.data, this.set)
    const checksum = this.checksum()

    const checksumBarcode = getBarcodeByIndex(checksum)
    const barcode = charsToBarcode(this.data)

    return {
      data: [barcode, checksumBarcode, STOP_DIGITS].join(''),
      text: this.text,
      checksum: checksum.toString(),
    }
  }
}
