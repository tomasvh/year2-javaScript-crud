/**
 * Module containing request routers.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import express from 'express'
import csurf from 'csurf'
import { isAuth } from '../helpers/authentication.js'
import { GetHandler } from '../controllers/getHandlers.js'
import { PostHandler } from '../controllers/postHandlers.js'

const crfProtection = csurf()
const parseForm = express.urlencoded({ extended: false })

export const requestRouter = express.Router()

const postHandlers = new PostHandler()
const getHandlers = new GetHandler()

// Routes to parts of the application that do not require authentication.
requestRouter.get('/', getHandlers.homeGet)

requestRouter.get('/login', crfProtection, getHandlers.loginGet)
requestRouter.post('/login', parseForm, crfProtection, postHandlers.loginPost)

requestRouter.get('/register', crfProtection, getHandlers.registerGet)
requestRouter.post('/register', parseForm, crfProtection, postHandlers.registerPost)

requestRouter.get('/read', crfProtection, getHandlers.readGet)

requestRouter.get('/readAll', crfProtection, getHandlers.readAllGet)
requestRouter.post('/readAll', parseForm, crfProtection, postHandlers.readAllPost)

requestRouter.get('/readSpecificUserAll', crfProtection, getHandlers.readSpecificUserAllGet)
requestRouter.post('/readSpecificUserAll', parseForm, crfProtection, postHandlers.readSpecificUserAllPost)

requestRouter.get('/readSpecific', crfProtection, getHandlers.readSpecificGet)
requestRouter.post('/readSpecific', parseForm, crfProtection, postHandlers.readSpecificPost)

// Routes to parts of the application that require authentication.
requestRouter.get('/logout', isAuth, crfProtection, getHandlers.logoutGet)
requestRouter.post('/logout', isAuth, parseForm, crfProtection, postHandlers.logoutPost)

requestRouter.post('/deleteSnippet', isAuth, parseForm, crfProtection, postHandlers.deletePost)
requestRouter.post('/deleteDatabase', isAuth, parseForm, crfProtection, postHandlers.deleteDatabasePost)

requestRouter.get('/create', isAuth, crfProtection, getHandlers.createGet)
requestRouter.post('/create', isAuth, parseForm, crfProtection, postHandlers.createPost)

requestRouter.post('/updateSnippet', isAuth, parseForm, crfProtection, postHandlers.updatePost)
requestRouter.post('/updateDatabase', isAuth, parseForm, crfProtection, postHandlers.updateDatabase)
