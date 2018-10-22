var credentials = require('./credentials.js')

/**
 * isValidEmail - Check if valid email
 *
 * @param  {String} email email address
 * @return {Boolean}       validity
 */
const isValidEmail = (email) => {
  const emailRegex = require('email-regex');
  return emailRegex().test(email);
};

/**
 * authenticate - Mandatory function to authenticate with labguru and get an access token
 *
 * @param {String} server
 * @param {String} email
 * @param {String} password
 * @returns {String} token
 */
const authenticate = async (server, email, password) => {
  const axios = require('axios');

  if (!isValidEmail(email)) {
    return;
  }
  var tokenUrl = server + '/api/v1/sessions.json';

  var body = {
    "login": email,
    "password": password
  };

  const response = await axios.post(tokenUrl, body);
  if (response.status !== 200) {
    throw new Error('Unable to connect to server.');
  };

  if (response.status === 200 && response.data.token === -1) {
    throw new Error('Wrong password.');
  } else {
    return response.data.token;
  };
};

module.exports = {
  authenticate
};