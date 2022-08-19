import assert from 'assert'

import { EAN2 } from './barcodes/ean2'
import { EAN5 } from './barcodes/ean5'
import { EAN8 } from './barcodes/ean8'
import { EAN13 } from './barcodes/ean13'
import { ITF } from './barcodes/itf'
import { ITF14 } from './barcodes/itf14'

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
