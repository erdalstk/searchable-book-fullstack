const nodemailer = require('nodemailer');
const config = require('../config/main');
const constants = require('../config/constants');

function sendMail(mailOptions) {
  const transporter = nodemailer.createTransport({
    host: config.mailer.host,
    port: config.mailer.port,
    secure: config.mailer.secure, // true for 465, false for other ports
    auth: {
      user: config.mailer.auth.user,
      pass: config.mailer.auth.pass
    }
  });

  return transporter
    .sendMail(mailOptions)
    .then(info => info)
    .catch(error => Promise.reject(error));
}

function sendResetPasswordEmail(userEmail, host, resetToken) {
  const mailOptions = {
    to: userEmail,
    from: constants.SEND_EMAIL.FROM,
    subject: constants.SEND_EMAIL.SUBJECT_RESET_PASSWORD,
    text:
      `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
        + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
        + 'https://'}${host}/#/reset_password/${resetToken}\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    html:
      `<p>${'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br /><br />'
        + 'Please click on the following link, or paste this into your browser to complete the process:<br /><br />'
        + 'https://'}${host}/#/reset_password/${resetToken}<br /><br />`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.<br /></p>'
  };
  return sendMail(mailOptions);
}

function sendResetPasswordDoneEmail(userEmail) {
  const mailOptions = {
    to: userEmail,
    from: constants.SEND_EMAIL.FROM,
    subject: constants.SEND_EMAIL.SUBJECT_RESET_PASSWORD,
    text: `${'Hello,\n\n'
      + 'This is a confirmation that the password for your account '}${userEmail} has just been changed.\n`,
    html: `<p>${'Hello,<br /><br />'
      + 'This is a confirmation that the password for your account '}${userEmail} has just been changed.<br /></p>`
  };
  return sendMail(mailOptions);
}

module.exports = {
  sendResetPasswordEmail,
  sendResetPasswordDoneEmail
};
