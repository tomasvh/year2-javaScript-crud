/**
 * The starting point of the application.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import express from 'express'
import hbs from 'express-hbs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import process from 'process'
import morgan from 'morgan'
import chalk from 'chalk'
import session from 'express-session'
import { mongoConnect } from './config/mongoose.js'
import MongoStore from 'connect-mongo'
import helmet from 'helmet'
import { router } from './routers/router.js'

/**
 * Main executing function.
 *
 * @async
 */
const main = async () => {
  const PORT = process.env.PORT
  const baseURL = process.env.BASE_URL

  // Using the module for mongoDB to connect to the database.
  await mongoConnect()

  // Creating the path to the main directory on the server.
  const dirFullName = dirname(fileURLToPath(import.meta.url))

  // Initiating express server.
  const server = express()

  // Telling the server to use helmet middleware for protection and adding some of the non-default protections.
  server.use(helmet({
    crossOriginResourcePolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginEmbedderPolicy: true
  }))

  // Setting up helmet to change defaults to not allow inline styles.
  server.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        styleSrc: ["'self'"]
      }
    })
  )

  // Setting cache control.
  server.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'no-store')
    next()
  })

  // Setting up Morgan to display server calls.
  server.use(morgan('tiny'))

  // Telling the server to use handlebars and telling it where to find the main layout and partials.
  server.engine('hbs', hbs.express4({
    defaultLayout: join(dirFullName, 'views', 'layouts', 'default'),
    partialsDir: join(dirFullName, 'views', 'partials')
  }))
  server.set('view engine', 'hbs')
  server.set('views', join(dirFullName, 'views'))

  server.use(express.urlencoded({ extended: false }))

  // Telling the server where to find static files.
  server.use(express.static(join(dirFullName, '..', 'public')))

  // Setting up the storage for sessions on the mongoDB database.
  const mongoSessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 1000 * 60 * 60 * 24, // 1 day.
    collectionName: 'MySessions'
  })

  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day.
      sameSite: 'lax'
    },
    store: mongoSessionStore
  }

  // Code snippet borrowed from exercise-pure-approval-soluction Author: Mats Loock, version: 1.0.0
  if (server.get('env') === 'production') {
    server.set('trust proxy', 1) // trust first proxy (the Nginx)
    sessionOptions.cookie.secure = true // Change the option in the cookie to be secure and only serve through https
  }

  // Setting up the express session functionality.
  server.use(session(sessionOptions))

  // Telling the server to use the baseURL provided in environment variables.
  server.use((req, res, next) => {
    res.locals.baseURL = baseURL
    next()
  })

  server.use('/', router)

  /**
   * Snippet of code copied from Mats Loocks repo @https://gitlab.lnu.se/1dv026/content/exercises/module-b/exercise-follow-the-route/-/tree/solution
   */
  server.use(function (err, req, res, next) {
    // 404 Not Found.
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(dirFullName, 'views', 'errors', '404.html'))
    }

    // 500 Internal Server Error (in production, all other errors send this response).
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(dirFullName, 'views', 'errors', '500.html'))
    }

    // Render a custom error page
    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  // Starting the server and telling it to listen to a port
  server.listen(PORT, () => {
    console.log(`Listening to port ${chalk.green(PORT)} \nexit by pressing ctrl-c`)
  })
}

main().catch(console.error)
