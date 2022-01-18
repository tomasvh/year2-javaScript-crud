/**
 * Module containing Authentication middleware functions
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

/**
 * Helper function to figure out if user is logged in.
 *
 * @param {object} req - Express server request object.
 * @param {object} res - Express server response object.
 * @param {object} next - Express middleware function to send the application forward.
 */
export function isAuth (req, res, next) {
  if (req.session.isAuth === true) {
    next()
  } else {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  }
}

/**
 * Function that checks if someone is logged in for menu purposes.
 *
 * @param {object} req - Express server request object.
 * @returns {boolean} - Returns true if someone is logged in.
 */
export function checkLoggedIn (req) {
  if (!req.session.isAuth) {
    return false
  } else {
    return true
  }
}
