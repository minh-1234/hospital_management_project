import 'dotenv/config'

export const env = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  USER_DB: process.env.USER_DB,
  PASSWORD_DB: process.env.PASSWORD_DB,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOST_URL: process.env.HOST_URL,
  HOST_URL_AUTH: process.env.HOST_URL_AUTH,
  JWT_ACCESS_PRIVATE_KEY: process.env.JWT_ACCESS_PRIVATE_KEY,
  JWT_REFRESH_PRIVATE_KEY: process.env.JWT_REFRESH_PRIVATE_KEY,
  ROLE_ADMIN: process.env.ROLE_ADMIN,
  ROLE_USER: process.env.ROLE_USER,
  SALT: process.env.SALT,
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  USER_MQ: process.env.USER_MQ,
  PASS_MQ: process.env.PASS_MQ,
  USER_REDIS_DOCKER: process.env.USER_REDIS_DOCKER,
  PASS_REDIS_DOCKER: process.env.PASS_REDIS_DOCKER
};
