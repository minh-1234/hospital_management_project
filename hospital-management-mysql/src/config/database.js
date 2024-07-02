
import mysql from 'mysql2'
import { env } from './environment.js'
// export const connection = mysql.createConnection({
//   host: env.HOST,
//   user: env.USER_DB,
//   password: env.PASSWORD_DB,
//   database: env.DATABASE_NAME,
//   multipleStatements: true
// })
export const connection = mysql.createPool({
  host: env.HOST,
  user: env.USER_DB,
  password: env.PASSWORD_DB,
  database: env.DATABASE_NAME,
  multipleStatements: true
})
export const CONNECT_DB = () => {
  connection.connect();
}
export const CLOSE_DB = () => {
  connection.end()
}

