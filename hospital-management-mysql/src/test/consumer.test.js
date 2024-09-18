import { consumerRabbiMQ, subcribeFailedNOtification } from "../utils/helper.js"

consumerRabbiMQ()
subcribeFailedNOtification().catch(error => {
  throw new Error(error)
})