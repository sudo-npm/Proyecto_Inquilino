const mailgun = require("mailgun-js");

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

async function sendEmail(to, subject, text) {
  const { IS_EMAIL_ACTIVATED, MAILGUN_KEY, MAILGUN_DOMAIN } = process.env;
  console.log(`Is email activated? ${IS_EMAIL_ACTIVATED}`);
  console.log(`If activated send email to "${to}" with subject: "${subject}".`);
  console.log(`And text: "${text}".`);
  if (IS_EMAIL_ACTIVATED === "true") {
    const mg = mailgun({
      apiKey: MAILGUN_KEY,
      domain: MAILGUN_DOMAIN,
    });

    const message = {
      from: "info_inquilinoapp@mail.com",
      to,
      subject,
      text,
    };

    await mg.messages().send(message);
  }
}

module.exports = {
  normalizePort,
  sendEmail,
};
