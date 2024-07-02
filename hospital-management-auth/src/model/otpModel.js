import { Schema, model } from 'mongoose'


const otpSchema = new Schema({
  otp: {
    type: String,
    require: [true, "must provide otp"],
    trim: true
  },
  email: {
    type: String,
    require: [true, "must provide email"],
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  time: {
    type: Date,
    default: Date.now,
    index: { expires: 60 } // set la 60s
  }
}, {
  collection: 'otp'
})

const Otp = model('Otp', otpSchema)
export const otpModel = {
  Otp
}