import { userModel } from "../model/userModel.js"
import { otpService } from "./otpService.js"
const signUp = async (reqBody) => {
  try {
    // check email user da ton tai chua return valid value
    const emailSignUp = reqBody.email
    const isInValidEmail = await userModel.User.findOne({ email: emailSignUp })
    //check email user
    if (isInValidEmail) {
      return { message: 'Email đã tồn tại !' }
    }
    const otp = await otpService.generateOtp(reqBody)
    return otp
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const verifyOtpSignUp = async (reqBody) => {
  //verify OTP to create User
  const otp = await otpService.verifyOtp(reqBody)
  if (!otp) {
    return { message: "Invalid OTP !" }
  }
  //adding user
  const newUser = await userModel.signUp(reqBody)
  return newUser
}
const signIn = async (reqBody) => {
  try {

    const loginUser = await userModel.signIn(reqBody);
    const { password, ...dataUser } = loginUser
    return dataUser
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


const getUser = async (cookie) => {
  try {
    const targetUser = await userModel.getUser(cookie)
    return targetUser
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const updateData = async (reqBody) => {
  try {
    // check email user da ton tai chua return valid value
    const emailSignUp = reqBody.email
    const isInValidEmail = await userModel.User.findOne({ email: emailSignUp })
    //check email user
    if (!isInValidEmail) {
      return { message: 'Email chưa tồn tại !' }
    }
    if (reqBody.password !== reqBody.rePassword) {
      return { message: 'Mật Khẩu không trùng khớp !' }
    }
    const otp = await otpService.generateOtp(reqBody)
    return otp
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const update = async (reqBody) => {
  //verify OTP to create User
  const otp = await otpService.verifyOtp(reqBody)
  if (!otp) {
    return { message: "Invalid OTP !" }
  }
  //adding user
  const userUpdate = await userModel.update(reqBody)
  return userUpdate
}
export const userService = {
  signUp,
  signIn,
  getUser,
  verifyOtpSignUp,
  updateData, update
}