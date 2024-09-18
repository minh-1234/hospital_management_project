
import amqp from 'amqplib'
import redis from 'redis'
import { env } from '../config/environment.js'
const urlRedis = `redis://${env.USER_REDIS_DOCKER}:${env.PASS_REDIS_DOCKER}@redis-docker:6379`
const urlRabbitmq = `amqp://${env.USER_MQ}:${env.PASS_MQ}@rabbitmq`
export const connectToRabbitMq = async () => {
  try {
    const connection = await amqp.connect(urlRabbitmq)
    if (!connection) throw new Error("Connection not established !")

    const channel = await connection.createChannel()
    return { channel, connection }
  } catch (error) {
    throw new Error(error)
  }
}

export const connectRedis = async () => {
  const client = redis.createClient({
    url: urlRedis
  })
  // client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect()
  console.log('Redis is connect !')
  return client
}
const redisClient = await connectRedis()
export const syncRabbitmqToRedis = async (value, queueName = '') => {
  try {
    const { channel, connection } = await connectToRabbitMq()
    const searchExchange = 'searchExchange'
    const searchQueue = 'searchQueue'
    const searchRoutingKeyDLX = 'searchRoutingKeyDLX'
    const searchExDLX = 'searchExDLX'
    const key = 'keyforseraching'
    // const queue = `search::${value.id}`
    const dataValue = {
      dataValues: value,
      queueName: queueName
    }
    const message = JSON.stringify(dataValue)
    await channel.assertExchange(searchExchange, 'direct', {
      durable: true
    })
    const result = await channel.assertQueue(searchQueue, {
      exclusive: false,
      deadLetterExchange: searchExDLX,
      deadLetterRoutingKey: searchRoutingKeyDLX
    })
    await channel.bindQueue(result.queue, searchExchange, key)
    await channel.sendToQueue(result.queue, Buffer.from(message))
    console.log(message)
    // await connection.close()

  } catch (error) {
    throw new Error(error)
  }
}
//khi xoa hay add trong databse thi reset redis
export const resetDataWhenAdding = async (queueName) => {
  const cartKeys = await scanKeys(`${queueName}:*`)
  for (const key of cartKeys) {
    await redisClient.del(key);
  }
}
// dung de tim tat ca cac key theo pattern trong redis. vd: theo pattern la patient thi tim cac key patient co trong redis
export const scanKeys = async (pattern) => {
  let matchingKeysCount = 0;
  let keys = [];

  const recursiveScan = async (cursor = '0') => {
    const result = await redisClient.scan(cursor, 'MATCH', pattern);
    console.log("Scan result:", result);
    const newCursor = result.cursor;
    const matchingKeys = result.keys;
    // console.log(matchingKeys)
    cursor = newCursor
    matchingKeysCount += matchingKeys.length;
    keys = keys.concat(matchingKeys);

    if (cursor == '0') {
      return keys;
    } else {
      return await recursiveScan(newCursor);
    }
  };

  return await recursiveScan();
}
// queueName la pattern. set key ton tai trong 30s.
const settingDataToRedis = async (data, queueName) => {
  // kiem tra neu nhu o key queue name qua 100 ban trong redis ta se reset
  const cartKeys = await scanKeys(`${queueName}:*`)
  if (cartKeys.length > 100) {
    await resetDataWhenAdding(queueName)
  }
  const value = data !== null ? JSON.stringify(data) : null
  // them vao redis
  const keySearch = `${queueName}:${data.id}`
  const result = await redisClient.set(keySearch, value, {
    EX: 30, // expire trong 30 s,
    NX: true
  })
  return result
}
//muc dich la dong bo du lieu cua data tu database sang redis
// Khi data cos su thay doi du lieu laapj tuc xoa du lieu cua entity do trong redis.
export const consumerRabbiMQ = async () => {
  const { channel, connection } = await connectToRabbitMq()
  try {
    const searchExchange = 'searchExchange'
    const searchQueue = 'searchQueue'
    const searchRoutingKeyDLX = 'searchRoutingKeyDLX'
    const searchExDLX = 'searchExDLX'
    const key = 'keyforseraching'
    await channel.assertExchange(searchExchange, 'direct', {
      durable: true
    })
    const result = await channel.assertQueue(searchQueue, {
      exclusive: false,
      deadLetterExchange: searchExDLX,
      deadLetterRoutingKey: searchRoutingKeyDLX
    })
    await channel.bindQueue(result.queue, searchExchange, key)
    channel.consume(result.queue, async (message) => {
      channel.prefetch(1);
      const validData = JSON.parse(message.content.toString())
      const { queueName, dataValues } = validData
      try {
        const result = await settingDataToRedis(dataValues, queueName)
        if (result) {
          console.log(`Recieved message from ${queueName}:: ${message.content.toString()}`)
          channel.ack(message)
        }
        else {
          throw new Error('send failed message to failed queue')
        }
      } catch (error) {
        channel.nack(message, false, false)
      }
    }, {
      noAck: false
    })
  } catch (error) {
    throw new Error(error)
  }
}
// neu nhu comsume ban dau fail se thu retry trong 3 lan, neu khong duoc se kill message.
let retryCount = 2
export const subcribeFailedNOtification = async () => {
  try {
    const { channel, connection } = await connectToRabbitMq()
    const searchRoutingKeyDLX = 'searchRoutingKeyDLX'
    const searchExDLX = 'searchExDLX'
    const searchQueueHandler = 'searchQueueHandler'
    //1 create exchange
    await channel.assertExchange(searchExDLX, 'direct', {
      durable: true
    })
    // assert queue
    const result = await channel.assertQueue(searchQueueHandler, {
      exclusive: false
    })
    // binding queue
    await channel.bindQueue(result.queue, searchExDLX, searchRoutingKeyDLX)
    // push message to  queue
    await channel.consume(result.queue, message => {
      channel.prefetch(1);
      // console.log('Recieved message failed plss hot fix :: ', message.content.toString())
      const validData = JSON.parse(message.content.toString())
      const { queueName, dataValues } = validData
      try {
        setTimeout(async () => {
          const result = await settingDataToRedis(dataValues, queueName)
          if (result) {
            console.log(`Recieved message from ${queueName}:: ${message.content.toString()}`)
            channel.ack(message)
          }
          else {
            throw new Error('send failed message to failed queue')
          }
        }, 3000 * retryCount) // so luong retry nhan 3s
      } catch (error) {
        retryCount += 1
        //check if retry 4 times will kill task
        if (retryCount === 4) {
          channel.cancel(result.queue)
          console.log("Max retry count reached. Task killed.");
          return;
        }
        channel.nack(message, false, true)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const delKeyRedis = async (queueName, id) => {
  const keySearch = `${queueName}:${id}`
  return await redisClient.del(keySearch)
}
// ham dung de dong bo du lieu khi tim ko co key khi tru xuat tim kiem.
export const checkCacheAndDb = async (queueName, id, callback) => {
  const keySearch = `${queueName}:${id}`
  try {
    const result = await redisClient.get(keySearch)
    if (result) {
      return JSON.parse(result)
    }
    else {
      // callback dung de tim du lieu khi miss cache
      const validData = await callback(id)
      if (!validData) {
        return null
      }

      // message queue thuc hien them data vao cache
      await syncRabbitmqToRedis(validData.dataValues, queueName)
      //tra ve data can thiet
      return validData.dataValues
    }
  } catch (error) {
    throw new Error(error)
  }
}