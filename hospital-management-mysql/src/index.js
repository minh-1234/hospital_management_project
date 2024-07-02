import express from 'express'
import cors from 'cors'
import { notFound } from './middleware/notFound.js'
import { env } from './config/environment.js'
//import { connection, CONNECT_DB, CLOSE_DB } from './config/database.js'
import cookieParser from 'cookie-parser'
import exitHook from 'async-exit-hook'
import Router from './route/index.js'
import bodyParser from 'body-parser'
import { corsOptions } from './config/cors.js';
import { connection, close } from './config/connection.js'
import axios from 'axios'
const app = express();

const start = async () => {
  // CONNECT_DB()
  connection();
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/', Router)
  app.listen(env.PORT, () =>
    // console.log(`Server is live @ ${env.HOST_URL}`),
    console.log(`Server is live on ${env.PORT}`),
  )
  //CLOSE_DB()
  exitHook(() => {
    console.log('exit app')
    close()
    //CLOSE_DB()
  })
}
start()