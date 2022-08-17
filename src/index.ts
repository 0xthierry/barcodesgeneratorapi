import assert from 'assert'
import { EAN13 } from './barcodes/ean/ean13'

import { EAN2 } from './barcodes/ean/ean2'
import { EAN5 } from './barcodes/ean/ean5'
import { EAN8 } from './barcodes/ean/ean8'

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
