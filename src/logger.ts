import pino from 'pino'

const formatters = {
  level: (label: string) => ({
    level: label,
  }),
}

export const logger = (name: string) =>
  pino({
    name,
    formatters,
    nestedKey: 'data',
    messageKey: 'message',
    redact: {
      paths: [
        'request.body.password',
        'request.body.email',
        'request.body.newPassword',
        'request.query["api-key"]',
        'request.headers["api-key"]',
        'request.headers.authorization',
      ],
      censor: '*',
    },
    mixin() {
      return {
        environment: process.env.NODE_ENV ?? 'development',
      }
    },
  })
