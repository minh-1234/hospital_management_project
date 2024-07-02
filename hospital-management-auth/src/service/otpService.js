import { sendMail } from '../config/sendMail.js'
import { otpModel } from '../model/otpModel.js'
import otpGenerator from 'otp-generator'
import { env } from '../config/environment.js'
import bcrypt from 'bcrypt'


const generateOtp = async (reqBody) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })
  const salt = await bcrypt.genSalt(parseInt(env.SALT))
  const hashOtp = await bcrypt.hash(otp, salt)
  const otpCreateNew = await otpModel.Otp.create({ ...reqBody, otp: hashOtp })
  await sendMail(reqBody.email, otp)
  return otpCreateNew ?
    {
      message: "Gửi OTP thành công !",
      otp: otpCreateNew
    } : { message: "Tạo OTP thất bại" }
}
const verifyOtp = async (reqBody) => {
  const targetEmail = reqBody.email
  const allOtp = await otpModel.Otp.find({ email: targetEmail })
  if (allOtp.length === 0) {
    return false
  }
  const targetOtp = allOtp[allOtp.length - 1]
  const targetOtpId = targetOtp._id
  const isValidOTp = await bcrypt.compare(reqBody.otp, targetOtp.otp)
  if (!isValidOTp) {
    if (reqBody.errorCount > 0) {
      // Nếu nhập sai OTP tăng thời gian của OTP lên 1 phần thời gian 
      const timeInspire = reqBody.errorCount * 30 + 30
      await otpModel.Otp.findOneAndUpdate({ _id: targetOtpId }, { index: { expires: timeInspire } })
      console.log("Cập nhật thành công cho OTP !")
    }
    return false
  }
  return isValidOTp;
}
export const otpService = {
  generateOtp, verifyOtp
}