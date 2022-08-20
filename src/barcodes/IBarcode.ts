interface Encode {
  data: string
  text: string
  checksum?: string
}

export interface IBarcode {
  encode: () => Encode
}
