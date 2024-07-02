import mongoose from 'mongoose'
import { env } from './environment.js';



export const connectDb = () => {
  return mongoose.connect(env.MONGO_URI);
}
export const closeDb = () => {
  return mongoose.connection.close()
}