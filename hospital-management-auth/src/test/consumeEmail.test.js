import { consumerRabbiMQ, subcribeFailedNOtification } from "../util/helper.js";

consumerRabbiMQ().catch(error => console.error(error))
subcribeFailedNOtification().catch(error => console.error(error))