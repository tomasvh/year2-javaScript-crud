/**
 * The routes.
 *
 * @author Mats Loock
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.1
 */

import express from 'express'
import createError from 'http-errors'
import { requestRouter } from './requestRouter.js'

export const router = express.Router()

router.use('/', requestRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
