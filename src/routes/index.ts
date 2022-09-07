import { Router } from 'express'
import { barcodeRoutes } from './barcode'

export const routes = Router()

routes.get('/_health_check', (req, res) => res.json({ ok: true }))
routes.use('/barcode', barcodeRoutes)
