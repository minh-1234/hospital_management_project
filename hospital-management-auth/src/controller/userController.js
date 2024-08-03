import { userService } from '../service/userService.js'
import { userModel } from '../model/userModel.js'
import { env } from '../config/environment.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const signUp = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const newUser = await userService.signUp(req.body);
    res.status(201).send(newUser)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const verifyOtpSignUp = async (req, res, next) => {
  try {
    const newUser = await userService.verifyOtpSignUp(req.body)
    res.status(201).send(newUser)
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
const signIn = async (req, res, next) => {
  try {
    const loginUser = await userService.signIn(req.body);
    if (loginUser.message) {
      return {
        message: loginUser.message
      }
    }
    const { dataUser, access_token, refresh_token } = loginUser
    await res.cookie("access_token", access_token, {
      httpOnly: true,
      maxAge: 60 * 1000,
      sameSite: "None",
      secure: true
    })
    await res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    })
    if (!access_token) {
      res.status(201).json(dataUser)
    }
    // const { access_token, refresh_token, password, ...result } = loginUser._doc
    res.status(201).json(dataUser)
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}
const getUser = async (req, res, next) => {
  try {
    const cookie = req.cookies["access_token"]
    const resfresh_cookie = req.cookies["refresh_token"]
    if (!cookie && !resfresh_cookie) {

      res.status(201).json(null)
    }
    else if (!cookie) {
      const cookieVarified = await userModel.getUserFreshToken(resfresh_cookie)
        .then(async (results) => {
          const access_token = await userModel.generateAcessToken({ id: results._doc._id })
          res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 60 * 1000,
            sameSite: "None",
            secure: true
          })
          return access_token
        })
      const User = await userService.getUser(cookieVarified)
      if (User.message) {
        res.status(200).json({ message: User.message })
      }
      const { password, ...dataUser } = User._doc
      res.status(200).json(dataUser)
    }
    else {
      const targetUser = await userService.getUser(cookie)
      if (targetUser.message) {
        res.status(200).json({ message: targetUser.message })
      }
      const { password, ...dataUser } = targetUser._doc
      res.status(200).json(dataUser)
    }

  } catch (e) {
    res.cookie("acess_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    })
    console.error("Error adding document: ", e);
  }
}
const authMiddleware = async (req, res, next) => {
  try {
    const cookie = req.body.access_token
    const resfresh_cookie = req.body.refresh_token
    if (!cookie && !resfresh_cookie) {
      res.status(201).json(null)
    }
    else if (!cookie) {
      const cookieVarified = await userModel.getUserFreshToken(resfresh_cookie)
        .then(async (results) => {
          const access_token = await userModel.generateAcessToken({ id: results._doc._id })
          res.cookie("access_token", access_token, {
            httpOnly: true,
            maxAge: 60 * 1000,
            sameSite: "None",
            secure: true
          })
          return access_token
        })
      const User = await userService.getUser(cookieVarified)
      if (User.message) {
        res.status(200).json({ message: User.message })
      }
      const { password, ...dataUser } = User._doc
      res.status(200).json(dataUser)
    }
    else {
      const targetUser = await userService.getUser(cookie)
      if (targetUser.message) {
        res.status(200).json({ message: targetUser.message })
      }
      const { password, ...dataUser } = targetUser._doc
      res.status(200).json(dataUser)
    }

  } catch (e) {
    res.cookie("acess_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    })
    console.error("Error adding document: ", e);
  }
}
const logOut = async (req, res, next) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    });
    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    });
    res.status(200).json({ message: "logout success" })
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const update = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const newUser = await userService.update(req.body);
    if (newUser.message) {
      res.status(201).send(newUser)
    }
    //sau khi doi mat khau thi log out de dang nhap lai
    res.cookie("access_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    });
    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(1)
    });
    res.status(201).send(newUser)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
const updateData = async (req, res, next) => {
  try {
    // const docRef = await addDoc(collection(db, "users"), req.body);
    const checkEmail = await userService.updateData(req.body);
    res.status(201).send(checkEmail)
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
export const userController = {
  signUp,
  signIn,
  getUser,
  logOut,
  verifyOtpSignUp,
  update, updateData,
  authMiddleware
}