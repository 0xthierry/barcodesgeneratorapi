import { RegexError } from '../errors'
import { IBarcode } from './IBarcode'

const START_DIGITS = '11010011100'
const START_DIGITS_VALUE = 105
const STOP_DIGITS = '1100011101011'
const VALID_DATA_REGEX = /^([0-9][0-9])*$/gi

const ENCONDING = [
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
] as const

const CHARACTER_SET = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59',
  '60',
  '61',
  '62',
  '63',
  '64',
  '65',
  '66',
  '67',
  '68',
  '69',
  '70',
  '71',
  '72',
  '73',
  '74',
  '75',
  '76',
  '77',
  '78',
  '79',
  '80',
  '81',
  '82',
  '83',
  '84',
  '85',
  '86',
  '87',
  '88',
  '89',
  '90',
  '91',
  '92',
  '93',
  '94',
  '95',
  '96',
  '97',
  '98',
  '99',
  'CODEB',
  'CODEA',
  'FNC1',
]

// https://courses.cs.washington.edu/courses/cse370/01au/minirproject/BarcodeBattlers/barcodes.html
// https://softmatic.com/barcode-code-128.html
// https://azaleabarcodes.com/faq/code-128/
// https://www.barcodefaq.com/1d/code-128/#CalculationExamples
// https://support.idautomation.com/Code-128/help-with-a-checksum-example/_1756
// https://honeywellsps.my.salesforce.com/sfc/p/#00000000SK3U/a/A00000000J9K/fZ9XdenyFImT6GKAicSkqOlgm76j4wto8iTx43qScAA
// https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html
// https://theasciicode.com.ar/ascii-control-characters/horizontal-tab-ascii-code-9.html
/**
 * Recebe uma string
 * Define qual grupo sera utilizado
 */

export class CODE128C implements IBarcode {
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
    const pairs = this.text.match(/(..?)/g) as string[]

    const sum =
      START_DIGITS_VALUE +
      pairs.reduce((acc, n, idx) => {
        const position = CHARACTER_SET.indexOf(n)
        return acc + position * (idx + 1)
      }, 0)

    return sum % 103
  }

  encode() {
    const checksum = this.checksum()
    const checksumBarcode = ENCONDING[checksum]
    const pairs = this.text.match(/(..?)/g) as string[]

    const digits = pairs.reduce((acc, n) => {
      const encondingIndex = CHARACTER_SET.indexOf(n)
      const encode = ENCONDING[encondingIndex]
      return acc.concat(encode)
    }, '')

    return {
      data: [START_DIGITS, digits, checksumBarcode, STOP_DIGITS].join(''),
      text: this.text,
      checksum: checksum.toString(),
    }
  }
}
