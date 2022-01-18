/**
 * Module for various helper functions.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

/**
 * Function that generates 8 random digits for human readable id number of snippet.
 *
 * @returns {number} - random 8 digit number.
 */
export function random8Digit () {
  const number = parseInt(Math.random() * 100000000, 10)
  return number
}

/**
 * Function to extract the Flash message and return it.
 *
 * @param {object} req - Express server request object.
 * @returns {string} - Flash message.
 */
export function extractFlashMessage (req) {
  if (req.session) {
    const message = req.session.flash
    req.session.flash = ''
    return message
  } else {
    return ''
  }
}
