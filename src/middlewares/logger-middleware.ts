import pinoHttp from 'pino-http'
import { nanoid } from 'nanoid'
import { logger } from '../logger'

export const loggerMiddleware = pinoHttp({
  logger: logger('API'),
  serializers: {
    req(req) {
      req.body = req.raw.body
      return req
    },
  },
  genReqId: () => nanoid(),
  customLogLevel(_, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    }
    if (res.statusCode >= 500 || (err !== null && err !== undefined)) {
      return 'error'
    }
    return 'info'
  },
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
  },
})
