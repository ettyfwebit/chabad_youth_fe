
import React, { useEffect, useState } from 'react';
import './SecretaryList.css';
import ReactPaginate from 'react-paginate';
import ManagerSideBar from '../ManagerSideBar/ManagerSideBar';

const SecretaryList = () => {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/children/')
      .then(response => response.json())
      .then(data => setChildren(data));
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // חישוב פריטים להצגה בעמוד נוכחי
  const offset = currentPage * itemsPerPage;
  const currentItems = children.slice(offset, offset + itemsPerPage);

  const pageCount = Math.ceil(children.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  }

  return (
    <div className="children-list-wrapper">
           <ManagerSideBar/> 

      <h2 className="table-title">Children</h2>
      <table className="children-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Points</th>
            <th>Date of birth</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((child) => (
            <tr key={child.child_id}>
              <td>{child.child_id}</td>
              <td>{child.name} </td>
              <td>{child.total_points} points</td>
              <td>{child.date_of_birth}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={null}  // הסרת החץ הקודם
        nextLabel={null}      // הסרת החץ הבא
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        activeClassName="active"
        breakLabel="..."
        pageRangeDisplayed={5}  // מספר העמודים המוצגים
      />

    </div>
  );
};


export default SecretaryList;
