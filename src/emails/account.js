const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

const msg = {
  to: 'ous1995alg@gmail.com', // Change to your recipient
  from: 'ous1995alg@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })