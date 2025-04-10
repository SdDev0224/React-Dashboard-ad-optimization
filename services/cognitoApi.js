/**
API methods for interacting with Cognito for user authentication.
These methods leverage AWS Amplify to make API calls.
*/

import { Auth } from 'aws-amplify'

/**
 * Signs in a user with Cognito
 *
 * @param username the email address for the user
 * @param password the password for the user
 * @returns {Promise<any>}
 */
export const signInWithCognito = (username, password) =>
    Auth.signIn(username, password)

/**
 * Sign out a user with Cognito
 *
 * @returns {Promise<any>}
 */
export const signOutWithCognito = () => Auth.signOut()

/**
 * Sign up a user with Cognito
 *
 * @param userData user data required at sign up
 * @returns {Promise<any>}
 */
export const signUpWithCognito = userData => Auth.signUp(userData)

/**
 * Send a reset email to the user using Cognito
 *
 * @param email the email address to send the reset password
 * @returns {Promise<any>}
 */
export const sendResetEmailWithCognito = email => Auth.forgotPassword(email)

/**
 * Reset a user's password with Cognito
 *
 * @param username the user's email address
 * @param code the reset code that was sent to the user via email
 * @param newPassword the new password
 * @returns {Promise<void>}
 */
export const resetPasswordWithCognito = (username, code, newPassword) =>
    Auth.forgotPasswordSubmit(username, code, newPassword)

/**
 * Get current user information for the authenticated user from Cognito
 *
 * @returns {Promise<any>}
 */
export const currentAuthenticatedUserWithCognito = () =>
    Auth.currentAuthenticatedUser()
