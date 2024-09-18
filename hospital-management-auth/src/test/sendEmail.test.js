import { syncRabbitmqToSendEmail } from "../util/helper.js";


await syncRabbitmqToSendEmail({ email: "minh@gmail.com", otp: '012345', otpCreateNew: true }).catch(error => console.error(error))