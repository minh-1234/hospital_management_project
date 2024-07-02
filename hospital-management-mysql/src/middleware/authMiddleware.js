
import { env } from "../config/environment.js"
import axios from 'axios'
import jwt from "jsonwebtoken"
axios.defaults.withCredentials = true
// kiểm tra user đã đăng nhập chưa

export const authMiddlewareLogin = async (req, res, next) => {
  try {
    if (!req.user) {
      const data = {
        access_token: req.cookies["access_token"],
        refresh_token: req.cookies["refresh_token"]
      }
      //const targetUser = await axios.post("http://localhost:8001/auth", data, { withCredentials: true })
      const targetUser = await axios.post("http://auth-api:8001/auth", data, { withCredentials: true })
      if (!targetUser.data) {
        res.status(422).json({ message: "You must login !" })
      }
      req.user = targetUser.data
    }
    next()
  } catch (error) {
    console.error("Error in authMiddlewareLogin:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

//kiểm tra user có quyên truy cập không 
export const authMiddlewareRole = async (req, res, next) => {
  const userLogged = req.user
  if (!userLogged) {
    res.status(422).json({ message: "You must login !" })
  }
  else if (userLogged.role !== env.ROLE_ADMIN) {
    res.status(422).json({ message: "You are not permisson !" })
  }
  else {
    next()
  }
}