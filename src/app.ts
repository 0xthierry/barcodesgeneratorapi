import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import helmet from 'helmet'
import { errors } from 'celebrate'
import { loggerMiddleware } from './middlewares/logger-middleware'
import { errorHandlerMiddleware } from './middlewares/error-middleware'
import { routes } from './routes'

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use(cors())
app.use(helmet())
app.use('/api/v1', routes)
app.use(errors({ statusCode: 422 }))
app.use(errorHandlerMiddleware)

export { app }
