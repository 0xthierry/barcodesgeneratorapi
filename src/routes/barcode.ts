import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'
import { EAN13 } from '../barcodes/ean13'
import { EAN2 } from '../barcodes/ean2'
import { EAN5 } from '../barcodes/ean5'
import { EAN8 } from '../barcodes/ean8'
import { ITF } from '../barcodes/itf'
import { ITF14 } from '../barcodes/itf14'
import { ImageGenerator, ImageGeneratorTypes } from '../image-generator'
import { CODE128 } from '../barcodes/code128'
import { CODE128A } from '../barcodes/code128/code128A'
import { CODE128B } from '../barcodes/code128/code128B'
import { CODE128C } from '../barcodes/code128/code128C'

export const barcodeRoutes = Router()

const barcodeTypes = {
  ean2: EAN2,
  ean5: EAN5,
  ean8: EAN8,
  ean13: EAN13,
  itf: ITF,
  itf14: ITF14,
  code128: CODE128,
  code128A: CODE128A,
  code128B: CODE128B,
  code128C: CODE128C,
} as const

const schema = celebrate({
  query: Joi.object()
    .keys({
      barcode_type: Joi.string()
        .valid(...Object.keys(barcodeTypes))
        .required(),
      return_type: Joi.string()
        .valid(...['jpeg', 'png'])
        .required(),
      text: Joi.string().required(),
    })
    .required(),
})

barcodeRoutes.get('/', schema, (req, res) => {
  const barcodeType = req.query.barcode_type as keyof typeof barcodeTypes
  const text = decodeURIComponent(req.query.text as string)
  const returnType = req.query.return_type

  const Barcode = barcodeTypes[barcodeType]
  const barcodeTarget = new Barcode(text)
  const barcode = barcodeTarget.encode()

  const imageGenerator = new ImageGenerator(
    barcode.data,
    returnType === 'png' ? ImageGeneratorTypes.PNG : ImageGeneratorTypes.JPEG,
  )

  const img = Buffer.from(imageGenerator.create())

  res.writeHead(200, {
    'Content-Type': returnType === 'png' ? 'image/gif' : 'image/gif',
    'Content-Length': img.length,
  })

  res.end(img)
})
