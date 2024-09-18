import { env } from "./environment.js"
import { google } from 'googleapis'
import nodemailer from 'nodemailer'


const o2AuthClient = new google.auth.OAuth2(env.CLIENT_ID, env.CLIENT_SECRET, env.REDIRECT_URI)
o2AuthClient.setCredentials({ refresh_token: env.REFRESH_TOKEN })
export const sendMail = async (emailReciever, otp) => {
  try {
    const accessTokenn = await o2AuthClient.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: "bomelatuyetnhat12@gmail.com",
        clientId: env.CLIENT_ID,
        clientSecret: env.CLIENT_SECRET,
        refreshToken: env.REFRESH_TOKEN,
        accessToken: accessTokenn,
      }
    })
    const info = await transport.sendMail({
      from: '"Hospital-management" Bomelatuyenhat12@gmail.com',
      to: `${emailReciever}`,
      subject: "Send OTP from Hospital-management",
      text: `Your OTP for authentication is ${otp}`,
      html: `<h4>Your OTP is <b>${otp}</b></h4>`,
    })
    return info
  }
  catch (error) {
    throw new Error(error)
  }
}

