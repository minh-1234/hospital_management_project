import { connectRedis } from '../utils/helper.js'

const redisClient = await connectRedis
export const readCache = async (req, res, next) => {
  const { id } = req.params
  const { queueName } = req.query
  const keySearch = `${queueName}:${id}`
  try {
    const result = await redisClient.get(keySearch)
    if (result) {
      return JSON.parse(result)
    }
    else {
      next()
    }
  } catch (error) {
    throw new Error(error)
  }
}