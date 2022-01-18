/**
 * Module with GET request handlers.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import { checkLoggedIn } from '../helpers/authentication.js'
import { extractFlashMessage } from '../helpers/helpers.js'

/**
 * A Encapsulation class for Get calls.
 */
export class GetHandler {
/**
 * Function to handle the home GET request.
 *
 * @param {object} req - Express server request object.
 * @param {object} res - Express server response object.
 */
  homeGet (req, res) {
    res.render('home', { loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the login GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  loginGet (req, res) {
    res.render('login', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the read GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  readGet (req, res) {
    res.render('read', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the readAll GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  readAllGet (req, res) {
    res.render('readAll', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the readSpecific GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  readSpecificGet (req, res) {
    res.render('readSpecific', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the readSpecificUser GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  readSpecificUserAllGet (req, res) {
    res.render('readSpecificUserAll', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the register GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  registerGet (req, res) {
    res.render('register', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the create GET request.
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  createGet (req, res) {
    res.render('create', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), username: req.session.userName, flash: extractFlashMessage(req) })
  }

  /**
   * Function to handle the logout GET request.
   *
   *
   * @param {object} req - Express server request object.
   * @param {object} res - Express server response object.
   */
  logoutGet (req, res) {
    res.render('logout', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: extractFlashMessage(req) })
  }
}
