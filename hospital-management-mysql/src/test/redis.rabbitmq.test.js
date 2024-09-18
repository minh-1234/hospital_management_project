import { patientModel } from "../model/patient.js";

import { checkCacheAndDb, delKeyRedis, resetDataWhenAdding } from "../utils/helper.js";
import { patientService } from "../service/patientService.js";
const test = async () => {
  const id = 1
  const callback = async (id) => {
    return await patientModel.patient.findByPk(id)
  }
  const result = await checkCacheAndDb('patient', id, callback)
  // // const result = await delKeyRedis('patient', 1)
  // console.log(result)
  // const result = await resetDataWhenAdding('patient')
  return result
}
const test_1 = async () => {
  const result = await patientService.findOneById('1')
  console.log(result)
  return result
}
// await test().catch(error => {
//   throw new Error(error)
// })
test_1().catch(error => console.error(error))