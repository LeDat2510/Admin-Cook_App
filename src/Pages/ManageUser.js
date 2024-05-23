import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, getDocs, doc, where, query, onSnapshot } from 'firebase/firestore';
import { db } from "../config/firestore";
import moment from 'moment';

const ManageUser = () => {

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredUsers = users.filter((user) => {
    return (
      search.toLowerCase() === '' ||
      user.id.toLowerCase().includes(search) ||
      user.user_name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      moment(user.date_created.toDate()).format('DD/MM/YYYY').toLowerCase().includes(search)
    );
  });


  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const records = filteredUsers.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredUsers.length / rowsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);


  const handleRowsPerPageChange = (event) => {
    const selectedRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(selectedRowsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const changeCPage = (id) => {
    setCurrentPage(id)
  }


  const nextPage = () => {
    const npage = Math.ceil(filteredUsers.length / rowsPerPage);
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }


  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "Users"), where('role', '!=', true)),
      async (snapShot) => {
        const userData = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userData);
        setCurrentPage(1);
      }
    );

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <>
      <div className="content">
        <div className="container-fluid">
          <h4 className="page-title">Quản lý người dùng</h4>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-9 col-sm-6 col-xs-6">
                      <div className="row-per-page" style={{ marginTop: '5px' }}>
                        <span style={{ fontSize: '20px' }}>Hiển thị số người dùng: </span>
                        <select style={{ fontSize: '15px' }} value={rowsPerPage} onChange={handleRowsPerPageChange}>
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                      <form className="navbar-left navbar-form nav-search mr-md-3" action onChange={handleSearchChange}>
                        <div className="input-group">
                          <input type="text" placeholder="Search..." className="form-control" />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="la la-search search-icon" />
                            </span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="card-body" style={{ overflowX: 'auto' }}>
                  <table className="table table-head-bg-primary">
                    <thead>
                      <tr>
                        <th scope="col">STT</th>
                        <th scope="col">ID</th>
                        <th scope="col">Ảnh</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.filter((user) => {
                        return search.toLowerCase() === '' ? user : user.id.toLowerCase().includes(search)
                          || user.user_name.toLowerCase().includes(search)
                          || user.email.toLowerCase().includes(search)
                          || moment(user.date_created.toDate()).format('DD/MM/YYYY').toLowerCase().includes(search)
                      }).map((user, index) => (
                        <tr key={user.id}>
                          <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                          <td>{user.id}</td>
                          <td><img src={user.user_image} alt='User' style={{ width: '100px', height: '100px' }} /></td>
                          <td>{user.user_name}</td>
                          <td>{user.email}</td>
                          <td>{moment(user.date_created.toDate()).format('DD/MM/YYYY')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <nav>
                    <ul className='pagination' style={{ display: 'flex', justifyContent: 'center' }}>
                      <li className='page-item'>
                        <a href='#' className='page-link' onClick={prePage}>
                          Prev
                        </a>
                      </li>
                      {
                        numbers.map((n, i) => (
                          <li className={`page-item ${currentPage === n ? 'active' : ''} `} key={i}>
                            <a href='#' className='page-link' onClick={() => changeCPage(n)}>
                              {
                                n
                              }
                            </a>
                          </li>
                        ))
                      }
                      <li className='page-item'>
                        <a href='#' className='page-link' onClick={nextPage}>
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageUser;