import { ChecksumError, RegexError } from '../errors'
import { ITF } from './itf'

const VALID_DATA_REGEX = /^[0-9]{13,14}$/gi

export class ITF14 extends ITF {
  constructor(data: string) {
    super(data, true)
    this.validate()
  }

  validate() {
    const isRegexValid = this.text.search(VALID_DATA_REGEX) !== -1

    if (!isRegexValid) {
      throw new RegexError()
    }

    if (
      this.text.length === 14 &&
      this.text[14] !== this.checksum().toString()
    ) {
      throw new ChecksumError()
    }
  }
}
