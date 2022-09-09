import { createCanvas } from 'canvas'

export enum ImageGeneratorTypes {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
}

interface ImageOptions {
  width: number
  height: number
  type: ImageGeneratorTypes
  margin: number
  barcodePadding: number
}

const defaultImageOptions: ImageOptions = {
  width: 2,
  type: ImageGeneratorTypes.PNG,
  height: 100,
  margin: 10,
  barcodePadding: 1,
}

export class ImageGenerator {
  options: ImageOptions = defaultImageOptions

  constructor(
    private readonly barcode: string,
    private readonly type: ImageGeneratorTypes,
    options?: Partial<ImageOptions>,
  ) {
    this.options = { ...defaultImageOptions, ...options }
  }

  create(): Buffer {
    const width = this.barcode.length * this.options.width

    const canvas = createCanvas(width, this.options.height)
    const ctx = canvas.getContext('2d')
    ctx.patternQuality = 'best'
    ctx.quality = 'best'
    ctx.antialias = 'subpixel'
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, this.options.height)

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, this.options.height)
    ctx.translate(0, 0)

    this.barcode.split('').forEach((bit, idx) => {
      ctx.fillStyle = Number(bit) === 1 ? '#000' : '#fff'
      ctx.fillRect(
        idx * this.options.width,
        0,
        this.options.width,
        this.options.height - 20,
      )
    })

    return canvas.toBuffer('image/png')
  }
}
