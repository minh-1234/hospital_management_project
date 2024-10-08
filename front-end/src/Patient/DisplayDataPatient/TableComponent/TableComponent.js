import React, { useEffect, useState } from "react";
import DisplayMoreInfo from "./DisplayMoreInfo/DisplayMoreInfo";
import { Button } from "react-bootstrap";
import { faAnglesLeft, faAnglesRight, faSort, faSortUp, faSortDown, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { env } from "../../../environment/environment";
import "./TableComponent.css";

const TableComponent = ({ dataPatientDisplay, setDataPatientDisplay, role }) => {
  const rowsPerPage = 9;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(
    Object.keys(dataPatientDisplay).length / rowsPerPage
  );
  const [currentID, setCurrentID] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirect, setSortDirect] = useState("desc");
  const [isDelete, setIsDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const goToPreviousPage = () => {
    console.log("cur page", currentPage);
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPatientStatusClass = (status) => {
    switch (status) {
      case "Đang điều trị":
        return "treating";
      case "Hoàn thành điều trị":
        return "complete-treat";
      default:
        return "no-treat";
    }
  };

  const handleClickRow = (id) => {
    setCurrentID(id);
    handleShow();
  };

  const handleSort = (colName) => {
    if (colName === sortColumn) {
      setSortDirect(sortDirect === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colName);
      setSortDirect("desc");
    }
  };
  const handleSelectAll = () => {
    setSelectedRows(!isSelectAll ? dataPatientDisplay.map(obj => obj.id) : [])
  }

  const handleDelete = async () => {
    try {
      const response = await axios.put(`${env.URL_BACKEND}/v1/patients/deleteMany`, selectedRows, { withCredentials: true });
      console.log(selectedRows);
      console.log("hello");


    }
    catch (error) {
      console.log(error);
    }
    window.location.reload();
  }

  useEffect(() => {
    if (!dataPatientDisplay || !sortColumn) {
      return;
    }
    const arr = Object.entries(dataPatientDisplay);
    arr.sort((a, b) => {
      const sortValueA = a[1][sortColumn];
      const sortValueB = b[1][sortColumn];
      if (sortColumn === "age") {
        return sortDirect === "desc"
          ? sortValueB - sortValueA
          : sortValueA - sortValueB;
      }
      return sortDirect === "desc"
        ? sortValueB.localeCompare(sortValueA)
        : sortValueA.localeCompare(sortValueB);
    });
    console.log("sorted arr", arr);
    console.log(dataPatientDisplay);
    let sortedArr = [];
    arr.forEach((item) => {
      sortedArr.push(item[1]);
    });
    setDataPatientDisplay(sortedArr);
  }, [sortColumn, sortDirect]);

  useEffect(() => {
    setCurrentID(""); // Reset the current ID when the page changes
  }, [currentPage]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
  const currentPageDataPatient = dataPatientDisplay.slice(startIndex, endIndex);
  return (
    <div>
      <DisplayMoreInfo
        show={show}
        handleClose={handleClose}
        dataMoreInfo={dataPatientDisplay[currentID]}
      />
      <div className='delete-group'>
        {isDelete &&
          <span style={{ marginRight: "1vw" }} >
            <Button variant='danger' disabled={!selectedRows.length} onClick={handleDelete}> Xoá </Button>
          </span>}
        {(role === "admin") && <i className='delete-icon' onClick={() => {
          setSelectedRows([])
          setIsDelete(prevState => !prevState)
          setIsSelectAll(false);
        }}><FontAwesomeIcon icon={isDelete ? faXmark : faTrashCan} /></i>}
      </div>
      <div className="outer-table">
        <table>
          <thead>
            <tr>
              {isDelete &&
                <th >
                  <i style={{ fontSize: "20px", marginRight: "10px" }} onClick={() => {
                    handleSelectAll();
                    setIsSelectAll(prevState => !prevState);
                  }}>
                    <FontAwesomeIcon icon={isSelectAll ? faSquareCheck : faSquare} />
                  </i>
                  <span>Xoá </span> </th>}
              <th>ID </th>
              <th
                className="sort-col"
                onClick={() => handleSort("lastMiddleName")}
              >
                <span>Họ và tên đệm</span>
                <span className="sort-icon">
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "lastMiddleName"
                        ? sortDirect === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </span>
              </th>
              <th className="sort-col" onClick={() => handleSort("firstName")}>
                <span>Tên</span>
                <span className="sort-icon">
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "firstName"
                        ? sortDirect === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </span>
              </th>
              <th className="sort-col" onClick={() => handleSort("gender")}>
                <span>Giới tính</span>
                <span className="sort-icon">
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "gender"
                        ? sortDirect === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </span>
              </th>
              <th className="sort-col" onClick={() => handleSort("age")}>
                <span>Tuổi</span>
                <span className="sort-icon">
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "age"
                        ? sortDirect === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </span>
              </th>
              <th>Chẩn đoán</th>

              <th className="sort-col" onClick={() => handleSort("status")}>
                <span>Trạng thái</span>
                <span className="sort-icon">
                  <FontAwesomeIcon
                    icon={
                      sortColumn === "status"
                        ? sortDirect === "asc"
                          ? faSortUp
                          : faSortDown
                        : faSort
                    }
                  />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageDataPatient.map((obj, index) => (
              <tr
                key={obj.citizenID}
                onClick={() =>
                  handleClickRow(
                    currentPage > 1
                      ? index + rowsPerPage * (currentPage - 1)
                      : index
                  )
                }
              >
                {isDelete &&
                  <td className='square-icon' style={{ fontSize: "25px", zIndex: "30" }} onClick={(event) => {
                    event.stopPropagation();
                    const updatedRows = [...selectedRows];
                    if (updatedRows.includes(obj.id)) {
                      updatedRows.splice(updatedRows.indexOf(obj.id), 1);
                    } else {
                      updatedRows.push(obj.id);
                    }
                    setSelectedRows(updatedRows);
                  }}>
                    <FontAwesomeIcon icon={selectedRows.includes(obj.id) ? faSquareCheck : faSquare} /> </td>}
                <td className="patient-id">{obj.citizenID}</td>
                <td className="patient-name">{obj.lastMiddleName}</td>
                <td>{obj.firstName}</td>
                <td>{obj.gender}</td>
                <td>{obj.age}</td>
                <td>{obj.diagnosis}</td>
                <td className="status-block">
                  <div
                    className={`status ${getPatientStatusClass(obj.status)}`}
                  >
                    {obj.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <Button
          className="table-num-btn"
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
        >
          <FontAwesomeIcon className="icon-arrow-table" icon={faAnglesLeft} />
        </Button>
        <span>{currentPage}</span>
        <Button
          className="table-num-btn"
          onClick={goToNextPage}
          disabled={currentPage >= totalPage}
        >
          <FontAwesomeIcon className="icon-arrow-table" icon={faAnglesRight} />
        </Button>
      </div>
    </div>
  );
};

export default TableComponent;
