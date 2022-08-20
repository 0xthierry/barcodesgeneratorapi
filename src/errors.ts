export class DomainError extends Error {}

export class RegexError extends DomainError {
  constructor() {
    super('The Input Provided is not valid')
    this.name = this.constructor.name
    Error.captureStackTrace(this, RegexError)
  }
}

export class ChecksumError extends DomainError {
  constructor() {
    super('The check digit is not valid')
    this.name = this.constructor.name
    Error.captureStackTrace(this, ChecksumError)
  }
}
