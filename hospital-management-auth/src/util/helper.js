import amqp from 'amqplib'
import { sendMail } from '../config/sendMail.js'
const urlRabbitmq = 'amqp://guest:12345@localhost'
// const urlRabbitmq = 'amqp://guest:12345@rabbitmq'

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
export const syncRabbitmqToSendEmail = async (value, queueName = '') => {
  try {
    const { channel, connection } = await connectToRabbitMq()
    const sendEmailExchange = 'sendEmailExchange'
    const sendEmailQueue = 'sendEmailQueue'
    const sendEmailRoutingKeyDLX = 'sendEmailRoutingKeyDLX'
    const sendEmailExDLX = 'sendEmailExDLX'
    const key = 'keyForSendEmail'
    // const queue = `search::${value.id}`
    const dataValue = {
      dataValues: value,
    }
    const message = JSON.stringify(dataValue)
    await channel.assertExchange(sendEmailExchange, 'direct', {
      durable: true
    })
    const result = await channel.assertQueue(sendEmailQueue, {
      exclusive: false,
      deadLetterExchange: sendEmailExDLX,
      deadLetterRoutingKey: sendEmailRoutingKeyDLX
    })
    await channel.bindQueue(result.queue, sendEmailExchange, key)
    await channel.sendToQueue(result.queue, Buffer.from(message))
    console.log(message)
    // await connection.close()

  } catch (error) {
    throw new Error(error)
  }
}

export const consumerRabbiMQ = async () => {
  const { channel, connection } = await connectToRabbitMq()
  try {
    const sendEmailExchange = 'sendEmailExchange'
    const sendEmailQueue = 'sendEmailQueue'
    const sendEmailRoutingKeyDLX = 'sendEmailRoutingKeyDLX'
    const sendEmailExDLX = 'sendEmailExDLX'
    const key = 'keyForSendEmail'
    // const result = await channel.assertQueue(searchQueue, {
    //   exclusive: false
    // })
    // await channel.bindQueue(result.queue, searchExchange, key)
    await channel.assertExchange(sendEmailExchange, 'direct', {
      durable: true
    })
    const result = await channel.assertQueue(sendEmailQueue, {
      exclusive: false,
      deadLetterExchange: sendEmailExDLX,
      deadLetterRoutingKey: sendEmailRoutingKeyDLX
    })
    await channel.bindQueue(result.queue, sendEmailExchange, key)
    channel.consume(result.queue, async (message) => {
      channel.prefetch(1);
      const validData = JSON.parse(message.content.toString())
      const { dataValues } = validData
      try {
        const { email, otp, otpCreateNew } = dataValues
        if (otpCreateNew) {
          console.log(`Recieved message from queue:: ${message.content.toString()}`)
          const result = await sendMail(email, otp)
          if (result) {
            channel.ack(message)
          }
          else {
            throw new Error('Send failed message to failed queue !')
          }
        }
        else {
          console.log(`Recieved message from queue:: ${message.content.toString()} :: OTP created failed`)
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
let retryCount = 2
export const subcribeFailedNOtification = async () => {
  try {
    const { channel, connection } = await connectToRabbitMq()
    const sendEmailRoutingKeyDLX = 'sendEmailRoutingKeyDLX'
    const sendEmailExDLX = 'sendEmailExDLX'
    const sendEmailQueueHandler = 'sendEmailQueueHandler'
    //1 create exchange
    await channel.assertExchange(sendEmailExDLX, 'direct', {
      durable: true
    })
    // assert queue
    const result = await channel.assertQueue(sendEmailQueueHandler, {
      exclusive: false
    })
    // binding queue
    await channel.bindQueue(result.queue, sendEmailExDLX, sendEmailRoutingKeyDLX)
    // push message to  queue
    await channel.consume(result.queue, message => {
      channel.prefetch(1);
      // console.log('Recieved message failed plss hot fix :: ', message.content.toString())
      const validData = JSON.parse(message.content.toString())
      const { dataValues } = validData
      try {
        setTimeout(async () => {
          const { email, otp, otpCreateNew } = dataValues
          if (otpCreateNew) {
            const result = await sendMail(email, otp)
            if (result) {
              console.log(`Recieved message from queue : ${message.content.toString()}`)
              channel.ack(message)
            }
            else {
              throw new Error('Send failed message to failed queue !')
            }
          }
          else {
            console.log(`Recieved message from failed queue : ${message.content.toString()} :: OTP created failed`)
          }
        }, 3000 * retryCount) // so luowngj retry nhan 3s
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