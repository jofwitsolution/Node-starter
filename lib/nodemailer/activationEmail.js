import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendActivationLink({ email, lastName, activationToken }) {
  const mailOption = {
    from: `Node starter <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Activate Your Account",
    // text: `Hey! ${lastName}. Please activate your account using the link below.`,
    html: `
              <body>
                <h1>Hey! ${lastName}.</h1>
                <p>Please activate your account by clicking activate below.</p>
                <a href="http://localhost:5000/api/auth/activate/${activationToken}">Activate</a>
                <p>Thank you!</p>
              </body>
              
              `,
  };

  return transporter.sendMail(mailOption);
}

export async function sendPasswordRecCode({ email, code }) {
  const mailOption = {
    from: `Node starter <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Recovery Code",
    // text: `Hey! ${lastName}. Please activate your account using the link below.`,
    html: `
              <body>
                <h1>Password Recovery</h1>
                <p>Your recovery code is: </p>
                <h2>${code}</h2>
                <p>Code expires in 5 minutes.</p>
              </body>
              
              `,
  };

  return transporter.sendMail(mailOption);
}
