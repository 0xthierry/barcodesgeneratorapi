import { ITF } from './itf'

const VALID_DATA_REGEX = /^[0-9]{13}$/gi

export class ITF14 extends ITF {
  constructor(data: string) {
    super(data, true)
  }

  valid() {
    return this.data.search(VALID_DATA_REGEX) !== -1
  }
}
