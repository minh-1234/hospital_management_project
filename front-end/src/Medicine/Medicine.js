import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import DisplayDataMedicine from './DisplayDataMedicine/DisplayDataMedicine'
import { env } from '../environment/environment'
const Medicine = ({ role }) => {
  const [dataMedicine, setDataMedicine] = useState([])
  const getMedicineStatus = (medicine) => {
    const curDate = moment();
    if (moment(medicine.expireDate, "DD-MM-YYYY") < curDate) {
      return "Hết hạn";
    }
    if (medicine.amount === "0") {
      return "Hết thuốc";
    }
    return "Sẵn sàng";
  }
  useEffect(() => {
    const getAllMedicine = async () => {
      try {
        let response = await axios.get(`${env.URL_BACKEND}/v1/medicines`, { withCredentials: true });
        response.data.forEach((obj) => {
          obj.status = getMedicineStatus(obj);
        })
        console.log(response.data)
        setDataMedicine(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMedicine();
  }, []);
  return (
    <div style={{ height: "100vh" }}>
      <DisplayDataMedicine dataMedicine={dataMedicine} role={role} />
    </div>
  )
}

export default Medicine