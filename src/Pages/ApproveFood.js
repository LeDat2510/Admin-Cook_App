import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, onSnapshot} from 'firebase/firestore';
import { db } from "../config/firestore";
import { Link } from 'react-router-dom';
import moment from 'moment';

const ApproveFood = () => {
    
    const [foods, setFoods] = useState([]);

    const [search, setSearch] = useState('');

    const [userName, setUserName] = useState({});

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const filteredFoods = foods.filter((food) => {
        return (
          search.toLowerCase() === '' ||
          food.food_name.toLowerCase().includes(search) ||
          moment(food.date_posted.toDate()).format('DD/MM/YYYY').toLowerCase().includes(search)
        );
      });

      const lastIndex = currentPage * rowsPerPage;
      const firstIndex = lastIndex - rowsPerPage;
      const records = filteredFoods.slice(firstIndex, lastIndex);
      const npage = Math.ceil(filteredFoods.length / rowsPerPage);
      const numbers = [...Array(npage + 1).keys()].slice(1);

      const handleRowsPerPageChange = (event) => {
        const selectedRowsPerPage = parseInt(event.target.value);
        setRowsPerPage(selectedRowsPerPage);
        setCurrentPage(1);
      };
    
      const handleSearchChange = (event) => {
        setSearch(event.target.value.toLowerCase());
        setCurrentPage(1);
      };

    const getUserNameByIds = async (userIds) => {
        const userRef = collection(db, 'Users');
        const userNames = {};
      
        for (const userId of userIds) {
          const querySnapshot = await getDocs(query(userRef, where('__name__', '==', userId)));
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userName = userData.user_name;
            userNames[userId] = userName; 
          });
        }
      
        return userNames;
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
        const npage = Math.ceil(filteredFoods.length / rowsPerPage);
        if (currentPage !== npage) {
          setCurrentPage(currentPage + 1);
        }
      }

      const DetailClick = () => {
        localStorage.setItem('approve', 'true');
      };
    
    
    
      useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'Foods'), where('status', '==', 'Awaiting approval')),
            async (snapshot) => {
              const FoodData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              setFoods(FoodData);
      
              const userIds = FoodData.map((food) => food.user_id);
              const userNames = await getUserNameByIds(userIds);
              setUserName(userNames);
            }
          );    
          return () => {
            unsubscribe(); 
          };
      }, []);

    return (
        <>
            <div className="content">
                <div className="container-fluid">
                    <h4 className="page-title">Duyệt công thức món ăn</h4>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-9 col-sm-6 col-xs-6">
                                            <div className="row-per-page" style={{ marginTop: '5px' }}>
                                                <span style={{ fontSize: '20px' }}>Hiển thị số dòng dữ liệu: </span>
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
                                                    <input type="text" placeholder="Search..." className="form-control"/>
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
                                                <th scope="col">Tên người đăng</th>
                                                <th scope="col">Tên món</th>
                                                <th scope="col">Ảnh</th>
                                                <th scope="col">Trạng thái</th>
                                                <th scope="col">Ngày đăng</th>
                                                <th scope="col">Chức năng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.filter((food) => {
                                                return search.toLowerCase() === '' ? food :
                                                food.food_name.toLowerCase().includes(search) ||
                                                moment(food.date_posted.toDate()).format('DD/MM/YYYY').toLowerCase().includes(search)
                                            }).map((food, index) => (
                                                <tr key={food.id}>
                                                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                                    <td>{userName[food.user_id]}</td>
                                                    <td>{food.food_name}</td>
                                                    <td><img src={food.food_image} alt='Food' style={{ width: '100px', height: '100px' }} /></td>
                                                    <td><span class="badge badge-warning">Đang chờ duyệt</span></td>
                                                    <td>{moment(food.date_posted.toDate()).format('DD/MM/YYYY')}</td>
                                                    <td><Link to={`/fooddetail/${food.id}`} class="btn btn-success" onClick={DetailClick}>Chi tiết</Link></td>
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

export default ApproveFood