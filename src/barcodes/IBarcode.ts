interface Encode {
  data: string
}

export interface IBarcode {
  encode: () => Encode
}
