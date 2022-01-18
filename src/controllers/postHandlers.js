/**
 * Module for POST request handlers.
 *
 * @author Tomas Marx-Raacz von Hidvég
 * @version 1.0.0
 */

import Snippet from '../models/snippetModel.js'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { checkLoggedIn } from '../helpers/authentication.js'
import * as helpers from '../helpers/helpers.js'

/**
 * Encapsulation for Post calls.
 */
export class PostHandler {
  /**
   * Function to handle the login POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async loginPost (req, res, next) {
    const { userName, password } = req.body

    try {
      const user = await User.findOne({ userName })

      if (!user) {
        req.session.flash = 'Something in your credentials is wrong, please try again'
        res.redirect('./login')
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        req.session.flash = 'Something in your credentials is wrong, please try again'
        res.redirect('./login')
      }
      req.session.flash = 'succesfully logged in'
      req.session.userName = userName
      req.session.isAuth = true
      res.redirect('./')
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the readSpecific POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async readSpecificPost (req, res, next) {
    const { postID } = req.body

    try {
      if (!postID) {
        req.session.flash = 'You left the field empty, try again'
        res.redirect('./readSpecific')
        // Do Something
      } else if (!await Snippet.findOne({ postID })) {
        req.session.flash = 'No such postID, try again'
        res.redirect('./readSpecific')
        // Do Something else
      } else {
        const snippetCollection = {
          snippets: (await Snippet.find({ postID })).map(snippet => ({
            postID: snippet.postID,
            userName: snippet.userName,
            snippet: snippet.snippet.trim()
          })
          )
        }
        res.render('resultMultiple', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: helpers.extractFlashMessage(req), items: snippetCollection })
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the readSpecificUserAll POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async readSpecificUserAllPost (req, res, next) {
    const { userName } = req.body

    try {
      if (!userName) {
        req.session.flash = 'You left the field empty, try again!'
        res.redirect('./readSpecificUserAll')
        // Do Something
      } else if (!await Snippet.findOne({ userName })) {
        req.session.flash = 'No such user, try again!'
        res.redirect('./readSpecificUserAll')
        // Do Something else
      } else {
        const snippetCollection = {
          snippets: (await Snippet.find({ userName })).map(snippet => ({
            csrfToken: req.csrfToken(),
            postID: snippet.postID,
            userName: snippet.userName,
            snippet: snippet.snippet.trim()
          })
          )
        }
        res.render('resultMultiple', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: helpers.extractFlashMessage(req), items: snippetCollection })
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the readAll POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async readAllPost (req, res, next) {
    try {
      const snippetCollection = {
        snippets: (await Snippet.find({})).map(snippet => ({
          csrfToken: req.csrfToken(),
          postID: snippet.postID,
          userName: snippet.userName,
          snippet: snippet.snippet.trim()
        })
        )
      }
      res.render('resultMultiple', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: helpers.extractFlashMessage(req), items: snippetCollection })
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the register POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async registerPost (req, res, next) {
    const { userName, password } = req.body
    try {
      let user = await User.findOne({ userName })
      if (user) {
        req.session.flash = 'User already exists'
        res.redirect('./register')
      }

      if (password.length < 10) {
        req.session.flash = 'Password is too short'
        res.redirect('./register')
      }
      const hashedPassword = await bcrypt.hash(password, 12)

      user = new User({
        userName,
        password: hashedPassword
      })

      user.save()
      req.session.flash = 'User successfully registered'
      res.redirect('./login')
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the create POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async createPost (req, res, next) {
    const { userName, postArea } = req.body

    const postID = helpers.random8Digit() // Creates a new random postID (I don't expect this application to reach more than 99,999,999 posts)

    try {
      if (!await Snippet.findOne({ postID })) {
        const snippet = new Snippet({
          userName,
          postID: postID,
          snippet: postArea.trim()
        })
        snippet.save()
        req.session.flash = 'Snippet created'
        res.redirect('./')
      } else {
        req.session.flash = 'Sorry, something in the internal operation failed and the postID generated already exists, try again.'
        res.redirect('./create')
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the update POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  updatePost (req, res, next) {
    const { postID, userName, snippet } = req.body

    if (req.session.userName === userName) {
      const data = {
        postID: postID,
        userName: userName,
        snippet: snippet.trim()
      }
      res.render('updateSnippet', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: helpers.extractFlashMessage(req), viewData: data })
    } else {
      const err = new Error('You are not allowed to update other users posts')
      err.status = 404
      next(err)
    }
  }

  /**
   * Function to handle the updateDatabase POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async updateDatabase (req, res, next) {
    const { postID, userName, snippet } = req.body
    try {
      if (userName === req.session.userName) {
        const update = await Snippet.updateOne({ postID }, {
          postID: postID,
          userName: userName,
          snippet: snippet.trim()
        })

        if (update.nModified === 1) {
          req.session.flash = 'Snippet ' + postID + ' updated.'
        } else {
          req.session.flash = 'Snippet ' + postID + ' was NOT updated due to... issues'
        }
        res.redirect('./read')
      } else {
        const err = new Error('You are not authorized to update another users snippet!')
        err.status = 404
        next(err)
      }
    } catch (err) {
      next(err)
    }
  }

  /**
   * Function to handle the delete POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async deletePost (req, res, next) {
    const { postID, userName, snippet } = req.body

    if (userName === req.session.userName) {
      const data = {
        postID: postID,
        userName: userName,
        snippet: snippet.trim()
      }
      res.render('deleteSnippet', { csrfToken: req.csrfToken(), loggedIn: checkLoggedIn(req), flash: helpers.extractFlashMessage(req), viewData: data })
    } else {
      const err = new Error('You are not authorized to delete another users snippet!')
      err.status = 404
      next(err)
    }
  }

  /**
   * Function to handle the deleteDatabase POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {object} next - Express middleware function to send the application forward.
   */
  async deleteDatabasePost (req, res, next) {
    const { postID, userName } = req.body

    try {
      if (userName === req.session.userName) {
        await Snippet.deleteOne({ postID })
        req.session.flash = 'Snippet ' + postID + ' deleted!'
        res.redirect('./read')
      } else {
        req.session.flash = 'You are not authorized to delete other users snippets!'
        const err = new Error('You are not authorized to delete other users snippets!')
        err.status = 404
        next(err)
      }
    } catch (err) {
      req.session.flash = 'Something went wrong with your database request! Please try again.'
      next(err)
    }
  }

  /**
   * Function to handle the logout POST request.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  logoutPost (req, res) {
    delete req.session.userName
    req.session.isAuth = false
    req.session.flash = 'Succesfully logged out.'
    res.redirect('./')
  }
}
