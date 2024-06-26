import assert from 'assert'

import { EAN2 } from '../src/barcodes/ean2'
import { EAN5 } from '../src/barcodes/ean5'
import { EAN8 } from '../src/barcodes/ean8'
import { EAN13 } from '../src/barcodes/ean13'
import { ITF } from '../src/barcodes/itf'
import { ITF14 } from '../src/barcodes/itf14'
import { charsToBarcode, CODE128, prepareInput } from '../src/barcodes/code128'
import { getIndexBasedOnStringAndCharacterSetA } from '../src/barcodes/code128/setA'
import { getIndexBasedOnStringAndCharacterSetB } from '../src/barcodes/code128/setB'
import { getIndexBasedOnStringAndCharacterSetC } from '../src/barcodes/code128/setC'

// https://www.gtin.info/itf-14-barcodes/
// https://www.barcodefaq.com/1d/interleaved-2of5/
// https://en.wikipedia.org/wiki/ITF-14#:~:text=ITF%2D14%20is%20the%20GS1,will%20always%20encode%2014%20digits.

const ean2 = new EAN2('53')
assert.deepStrictEqual(ean2.encode().data, '010110110001010100001')

const ean5 = new EAN5('52495')
assert.deepStrictEqual(
  ean5.encode().data,
  '010110111001010010011010011101010001011010110001',
)

const ean8 = new EAN8('1234567')
assert.deepStrictEqual(
  ean8.encode().data,
  '1010011001001001101111010100011010101001110101000010001001110010101',
)

const ean13 = new EAN13('210987654321')
assert.deepStrictEqual(
  ean13.encode().data,
  '10100110010001101001011100010010111011000010101010100111010111001000010110110011001101110010101',
)

const itf03 = new ITF('03')
assert.deepStrictEqual(itf03.encode().data, '1010100100110110101101')

const itf67 = new ITF('67')
assert.deepStrictEqual(itf67.encode().data, '1010101101101001001101')

const itf14 = new ITF14('9876543210921')
assert.deepStrictEqual(
  itf14.encode().data,
  '1010100110101100101010010011011011010110010100110110010101001101010010011010110010110100110010010101101101',
)

const CHARACTERS_A = [
  ' ',
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '\x00',
  '\x01',
  '\x02',
  '\x03',
  '\x04',
  '\x05',
  '\x06',
  '\x07',
  '\x08',
  '\x09',
  '\x0a',
  '\x0b',
  '\x0c',
  '\x0d',
  '\x0e',
  '\x0f',
  '\x10',
  '\x11',
  '\x12',
  '\x13',
  '\x14',
  '\x15',
  '\x16',
  '\x17',
  '\x18',
  '\x19',
  '\x1a',
  '\x1b',
  '\x1c',
  '\x1d',
  '\x1e',
  '\x1f',
  'É',
  'Ê',
  'Ë',
  'Ì',
  'Í',
  'Î',
  'Ï',
]

assert.deepStrictEqual(
  CHARACTERS_A.map((char, idx) => [char, idx]),
  CHARACTERS_A.map((char: string, idx) => [
    char,
    getIndexBasedOnStringAndCharacterSetA(char),
  ]),
)

const CHARACTERS_B = [
  ' ',
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '{',
  '|',
  '}',
  '~',
  '\x7f',
  'É',
  'Ê',
  'Ë',
  'Ì',
  'Í',
  'Î',
  'Ï',
]

assert.deepStrictEqual(
  CHARACTERS_B.map((char, idx) => [char, idx]),
  CHARACTERS_B.map((char: string, idx) => [
    char,
    getIndexBasedOnStringAndCharacterSetB(char),
  ]),
)

const CHARACTERS_C = [
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
  'Í',
  'Î',
  'Ï',
]

assert.deepStrictEqual(
  CHARACTERS_C.map((char, idx) => [char, idx]),
  CHARACTERS_C.map((char: string) => [
    char,
    getIndexBasedOnStringAndCharacterSetC(char),
  ]),
)

assert.deepStrictEqual(prepareInput('\tHi\nHI', 'A'), 'Ð\tHËi\nHI')
assert.deepStrictEqual(prepareInput('\tHii\nHI', 'A'), 'Ð\tHÍiiÎ\nHI')
assert.deepStrictEqual(prepareInput('\tHii\nHI'), 'Ð\tHÍiiÎ\nHI')
assert.deepStrictEqual(prepareInput('\tHii\nHI1234', 'A'), 'Ð\tHÍiiÎ\nHIÌ1234')
assert.deepStrictEqual(
  prepareInput('\tHii\nHI123456A', 'A'),
  'Ð\tHÍiiÎ\nHIÌ123456ÎA',
)
assert.deepStrictEqual(prepareInput('iiiiii\nii', 'B'), 'ÑiiiiiiË\nii')
assert.deepStrictEqual(prepareInput('iiiiii\n\nii', 'B'), 'ÑiiiiiiÎ\n\nÍii')
assert.deepStrictEqual(
  prepareInput('555555iiiiii\n\nii'),
  'Ò555555ÍiiiiiiÎ\n\nÍii',
)
assert.deepStrictEqual(charsToBarcode('Ò55'), '1101001110011101000110')
assert.deepStrictEqual(
  charsToBarcode('Ð55'),
  '110100001001101110010011011100100',
)
assert.deepStrictEqual(
  charsToBarcode('Ò555555ÍiiiiiiÎ\n\nÍii'),
  '1101001110011101000110111010001101110100011010111101110100001101001000011010010000110100100001101001000011010010000110100111010111101000011001010000110010101111011101000011010010000110100',
)
assert.deepStrictEqual(
  charsToBarcode('ÑiiiiiiÎ\n\nÍii'),
  '11010010000100001101001000011010010000110100100001101001000011010010000110100111010111101000011001010000110010101111011101000011010010000110100',
)
assert.deepStrictEqual(
  charsToBarcode('Ð\tHÍiiÎ\nHIÌ123456ÎA'),
  '11010000100100001101001100010100010111101110100001101001000011010011101011110100001100101100010100011000100010101110111101011001110010001011000111000101101110101111010100011000',
)
assert.deepStrictEqual(
  charsToBarcode('Ð55'),
  '110100001001101110010011011100100',
)

const d55 = new CODE128('55')

assert.deepStrictEqual(d55.encode(), {
  checksum: '2',
  data: '110100001001101110010011011100100110011001101100011101011',
  text: '55',
})

const fromCodeAWithShiftB = new CODE128('\tHi\nHI')
/**
 * 'Ð\tHËi\nHI'
 * Ð - 103 * 1 = 103
 * \t - 73 * 2 = 146
 * H - 40 * 3 = 120
 * Ë - 98 * 4 = 392
 * i - 73 * 5 = 365
 * \n - 74 * 6 = 444
 * H - 40 * 7 = 280
 * I - 41 * 8 = 328
 * sum = 2178
 * mod = 2178 % 103 = 15 = checksum
 */
assert.deepStrictEqual(fromCodeAWithShiftB.encode(), {
  checksum: '15',
  data: '1101000010010000110100110001010001111010001010000110100100001100101100010100011000100010101110011001100011101011',
  /// //'1101000010010000110100110001010001111010001010000110100100001100101100010100011000100010101110011001100011101011'
  text: '\tHi\nHI',
})
