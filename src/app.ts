import express, { Router } from 'express'
import { CODE128C } from './barcodes/code128c'
import { EAN13 } from './barcodes/ean13'
import { EAN2 } from './barcodes/ean2'
import { EAN5 } from './barcodes/ean5'
import { EAN8 } from './barcodes/ean8'
import { ITF } from './barcodes/itf'
import { ITF14 } from './barcodes/itf14'
import { ImageGenerator, ImageGeneratorTypes } from './image-generator'

const app = express()
const routes = Router()

const barcodeTypes = {
  ean2: EAN2,
  ean5: EAN5,
  ean8: EAN8,
  ean13: EAN13,
  itf: ITF,
  itf14: ITF14,
  code128c: CODE128C,
} as const

routes.get('/barcode', (req, res) => {
  const type = req.query.type
  const code = req.query.code
  const returnType = req.query.return_type

  // @ts-expect-error
  const Barcode = barcodeTypes[type as string]

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!Barcode) {
    return res.status(422).json({
      message: 'Invalid barcode type',
    })
  }

  const barcode = new Barcode(code)
  const imageGenerator = new ImageGenerator(
    barcode.encode().data,
    returnType === 'png' ? ImageGeneratorTypes.PNG : ImageGeneratorTypes.JPEG,
  )
  const img = Buffer.from(imageGenerator.create())

  res.writeHead(200, {
    'Content-Type': returnType === 'png' ? 'image/png' : 'image/jpeg',
    'Content-Length': img.length,
  })

  res.end(img)
})

app.use('/api/v1', routes)

export { app }
