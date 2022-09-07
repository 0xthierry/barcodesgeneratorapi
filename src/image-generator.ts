import { createCanvas } from 'canvas'

export enum ImageGeneratorTypes {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
}

export class ImageGenerator {
  constructor(
    private readonly data: string,
    private readonly type: ImageGeneratorTypes,
  ) {}

  create(): Buffer {
    const width = this.data.length + 10
    const height = 50
    const quiteZoneWidth = 5

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)

    this.data.split('').forEach((bit, idx) => {
      context.fillStyle = Number(bit) === 1 ? '#000' : '#fff'
      context.fillRect(quiteZoneWidth + idx, 10, 1, 30)
    })

    // @ts-expect-error
    return canvas.toBuffer(this.type as string)
  }
}
