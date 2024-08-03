
import express from 'express'
import { env } from './config/environment.js'
import { connectDb, closeDb } from './config/database.js'
import cookieParser from "cookie-parser"
import bodyParser from 'body-parser'
import cors from 'cors'
import { corsOptions } from './config/cors.js'
import exitHook from 'async-exit-hook'
import Router from './route/index.js'


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions))

// Routes
app.use('/', Router)

const start = async () => {
  try {
    await connectDb();
    app.listen(env.PORT, () => {
      console.log(`Example app listening on ${env.HOST_URL}`)
      // console.log(`Server is live on ${env.PORT}`)
    })
    exitHook(() => {
      closeDb()
      console.log('exit app')
    })
  }
  catch (error) {
    console.log(error);
  }
}
start();
