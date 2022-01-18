/**
 * Module for controlling the connection to the mongoDB database.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import chalk from 'chalk'

/**
 * Function to connect to the database.
 *
 * @returns {object} - Database connection
 */
export const mongoConnect = async () => {
  mongoose.connection.on('connected', () => console.log(`Mongoose is ${chalk.green('Connected')}.`))
  mongoose.connection.on('error', error => console.error(`Mongoose has found an error: ${chalk.red(error)}`))
  mongoose.connection.on('disconnected', () => console.log(`Mongoose is ${chalk.red('Disconnected')}, bye bye.`))

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(`Application terminated, Mongoose  ${chalk.red('Shutting down...')}, bye bye.`)
      process.exit(0)
    })
  })

  return mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}
