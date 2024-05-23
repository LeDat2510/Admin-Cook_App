import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firestore'
import { Chart as ChartJS } from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import moment from 'moment'

const Statistics = () => {

    const [userCount, setUserCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [recipeCount, setRecipeCount] = useState(0);
    const [blogCount, setBlogCount] = useState(0);
    const [recipesMonthlyData, setRecipesMonthlyData] = useState([]);
    const [blogMonthlyData, setBlogMonthlyData] = useState([]);
    const [totalApprovePost, setTotalApprovePost] = useState([]);
    const [totalNotApprovePost, setTotalNotApprovePost] = useState([]);
    const currentYear = moment().year();

    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const filteredUsers = users.filter((user) => {
        return (
            search.toLowerCase() === '' ||
            user.user_name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search)
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

    const CountApproveData = async (userIds) => {
        const userRef = collection(db, 'ApproveFoods');
        const blogRef = collection(db, 'ApproveBlog');
        const count = {};

        const foodPromises = userIds.map(async (userID) => {
            const snapshot = await getDocs(query(userRef, where('id_user', '==', userID)));
            const foodCount = snapshot.size;
            return { userID, foodCount };
        });

        const blogPromises = userIds.map(async (userID) => {
            const snapshot = await getDocs(query(blogRef, where('id_user', '==', userID)));
            const blogCount = snapshot.size;
            return { userID, blogCount };
        });

        const foodResults = await Promise.all(foodPromises);
        const blogResults = await Promise.all(blogPromises);

        for (const { userID, foodCount } of foodResults) {
            count[userID] = foodCount;
        }

        for (const { userID, blogCount } of blogResults) {
            if (count[userID]) {
                count[userID] += blogCount;
            } else {
                count[userID] = blogCount;
            }
        }

        return count;
    };

    const CountNotApproveData = async (userIds) => {
        const userRef = collection(db, 'NotApproveFoods');
        const blogRef = collection(db, 'NotApproveBlog');
        const count = {};

        const foodPromises = userIds.map(async (userID) => {
            const snapshot = await getDocs(query(userRef, where('id_user', '==', userID)));
            const foodCount = snapshot.size;
            return { userID, foodCount };
        });

        const blogPromises = userIds.map(async (userID) => {
            const snapshot = await getDocs(query(blogRef, where('id_user', '==', userID)));
            const blogCount = snapshot.size;
            return { userID, blogCount };
        });

        const foodResults = await Promise.all(foodPromises);
        const blogResults = await Promise.all(blogPromises);

        for (const { userID, foodCount } of foodResults) {
            count[userID] = foodCount;
        }

        for (const { userID, blogCount } of blogResults) {
            if (count[userID]) {
                count[userID] += blogCount;
            } else {
                count[userID] = blogCount;
            }
        }

        return count;
    };

    /*
      const CountApproveData = async (userIds) => {
  const userRef = collection(db, 'ApproveFoods');
  const blogRef = collection(db, 'ApproveBlogs');
  const count = {};

  const foodPromises = userIds.map((userID) => {
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(
        query(userRef, where('id_user', '==', userID)),
        (snapshot) => {
          const foodCount = snapshot.size;
          resolve({ userID, foodCount });
        }
      );

      return unsubscribe;
    });
  });

  const blogPromises = userIds.map((userID) => {
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(
        query(blogRef, where('id_user', '==', userID)),
        (snapshot) => {
          const blogCount = snapshot.size;
          resolve({ userID, blogCount });
        }
      );

      return unsubscribe;
    });
  });

  const foodResults = await Promise.all(foodPromises);
  const blogResults = await Promise.all(blogPromises);

  for (const { userID, foodCount } of foodResults) {
    count[userID] = foodCount;
  }

  for (const { userID, blogCount } of blogResults) {
    if (count[userID]) {
      count[userID] += blogCount;
    } else {
      count[userID] = blogCount;
    }
  }

  return count;
};
    */
    /*
    const CountApproveData = async (userIds) => {
        const userRef = collection(db, 'ApproveFoods');
        const blogRef = collection(db, 'ApproveBlogs');
        const count = {};
      
        for (const userID of userIds) {
          const foodSnapshot = await getDocs(query(userRef, where('id_user', '==', userID)));
          const blogSnapshot = await getDocs(query(blogRef, where('id_user', '==', userID)));
      
          const foodCount = foodSnapshot.size;
          const blogCount = blogSnapshot.size;
      
          count[userID] = foodCount + blogCount;
        }
      
        return count;
      };

      const CountNotApproveData = async (userIds) => {
        const userRef = collection(db, 'NotApproveFoods');
        const blogRef = collection(db, 'NotApproveBlogs');
        const count = {};
      
        for (const userID of userIds) {
          const foodSnapshot = await getDocs(query(userRef, where('id_user', '==', userID)));
          const blogSnapshot = await getDocs(query(blogRef, where('id_user', '==', userID)));
      
          const foodCount = foodSnapshot.size;
          const blogCount = blogSnapshot.size;
      
          count[userID] = foodCount + blogCount;
        }
      
        return count;
      };
*/

    /*
    const getAllUsers = () => {
        const querySnapshot = onSnapshot(query(collection(db, "Users"), where('role', '==', true)),
            async (snapShot) => {
                const users = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(users);
                setCurrentPage(1);
            });
        return querySnapshot;
    }*/

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
        const CountUser = onSnapshot(query(collection(db, 'Users'), where('role', '==', false)),
            async (snapShot) => {
                setUserCount(snapShot.size);
            })

        const CountCategories = onSnapshot(collection(db, 'FoodCategories'),
            async (snapShot) => {
                setCategoriesCount(snapShot.size);
            })

        const CountRecipes = onSnapshot(query(collection(db, 'Foods'), where('status', '==', 'Approve')),
            async (snapShot) => {
                setRecipeCount(snapShot.size);
            })

        const CountBlog = onSnapshot(query(collection(db, 'Blog'), where('status', '==', 'Approve')),
            async (snapShot) => {
                setBlogCount(snapShot.size);
            })

        const CountRecipesByMonth = onSnapshot(query(collection(db, 'Foods'), where('status', '==', 'Approve')), async (snapshot) => {
            const data = Array(12).fill(0);

            snapshot.forEach((doc) => {
                const postDate = moment(doc.data().date_posted.toDate());
                const year = postDate.year();
                const month = postDate.month();

                if (year === currentYear) {
                    data[month] += 1;
                }
            });

            setRecipesMonthlyData(data);
        });

        const CountBlogByMonth = onSnapshot(query(collection(db, 'Blog'), where('status', '==', 'Approve')), async (snapshot) => {
            const data = Array(12).fill(0);

            snapshot.forEach((doc) => {
                const postDate = moment(doc.data().date_posted.toDate());
                const year = postDate.year();
                const month = postDate.month();

                if (year === currentYear) {
                    data[month] += 1;
                }
            });

            setBlogMonthlyData(data);
        });

        const fetchData = async () => {
            const querySnapshot = onSnapshot(query(collection(db, "Users"), where('role', '==', true)),
                async (snapshot) => {
                    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUsers(users);

                    const userId = users.map((user) => user.id);
                    const totalApproveData = await CountApproveData(userId);
                    setTotalApprovePost(totalApproveData)

                    const totalNotApproveData = await CountNotApproveData(userId);
                    setTotalNotApprovePost(totalNotApproveData)
                    setCurrentPage(1);
                });
            return querySnapshot;
        };

        return () => {
            CountUser();
            CountCategories();
            CountRecipes();
            CountBlog();
            CountRecipesByMonth();
            CountBlogByMonth();
            fetchData();
        };
    }, [])

    console.log(recipesMonthlyData)

    return (
        <>
            <div className="content">
                <div className="container-fluid">
                    <h4 className="page-title">Thống kê</h4>
                    <div className="row">
                        <div class="col-md-3">
                            <div class="card card-stats">
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-5">
                                            <div class="icon-big text-center icon-warning">
                                                <i class="la la-user text-primary"></i>
                                            </div>
                                        </div>
                                        <div class="col-7 d-flex align-items-center">
                                            <div class="numbers">
                                                <p class="card-category">Người Dùng</p>
                                                <h4 class="card-title text-center">{userCount}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card card-stats">
                                <div class="card-body ">
                                    <div class="row">
                                        <div class="col-5">
                                            <div class="icon-big text-center">
                                                <i class="la la-list text-primary"></i>
                                            </div>
                                        </div>
                                        <div class="col-7 d-flex align-items-center">
                                            <div class="numbers">
                                                <p class="card-category">Loại Món</p>
                                                <h4 class="card-title text-center">{categoriesCount}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card card-stats">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-5">
                                            <div class="icon-big text-center">
                                                <i class="la la-clipboard text-primary"></i>
                                            </div>
                                        </div>
                                        <div class="col-7 d-flex align-items-center">
                                            <div class="numbers">
                                                <p class="card-category">Công Thức</p>
                                                <h4 class="card-title text-center">{recipeCount}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card card-stats">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-5">
                                            <div class="icon-big text-center">
                                                <i class="la la-pencil-square text-primary"></i>
                                            </div>
                                        </div>
                                        <div class="col-7 d-flex align-items-center">
                                            <div class="numbers">
                                                <p class="card-category">Blog</p>
                                                <h4 class="card-title text-center">{blogCount}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">Số lượng bài đăng theo tháng</h4>
                                </div>
                                <div className="card-body">
                                    <Bar
                                        data={{
                                            labels: ["Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05", "Tháng 06", "Tháng 07", "Tháng 08", "Tháng 09", "Tháng 10", "Tháng 11", "Tháng 12"],
                                            datasets: [
                                                {
                                                    label: "Số bài đăng công thức",
                                                    data: recipesMonthlyData
                                                },
                                                {
                                                    label: "Số bài đăng Blog",
                                                    data: blogMonthlyData
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-9 col-sm-6 col-xs-6">
                                            <div className="row-per-page" style={{ marginTop: '5px' }}>
                                                <span style={{ fontSize: '20px' }}>Hiển thị số người quản lý: </span>
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
                                                <th scope="col" className='text-center'>STT</th>
                                                <th scope="col" className='text-center'>Ảnh</th>
                                                <th scope="col" className='text-center'>Tên</th>
                                                <th scope="col" className='text-center'>Email</th>
                                                <th scope="col" className='text-center'>Số bài đã duyệt</th>
                                                <th scope="col" className='text-center'>Số bài không duyệt</th>
                                                <th scope="col" className='text-center'>Chức năng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.filter((user) => {
                                                return search.toLowerCase() === '' ? user :
                                                    user.user_name.toLowerCase().includes(search)
                                                    || user.email.toLowerCase().includes(search)
                                            }).map((user, index) => (
                                                <tr key={user.id}>
                                                    <td className='text-center'>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                                    <td className='text-center'><img src={user.user_image} alt='User' style={{ width: '100px', height: '100px' }} /></td>
                                                    <td className='text-center'>{user.user_name}</td>
                                                    <td className='text-center'>{user.email}</td>
                                                    <td className='text-center'>{totalApprovePost[user.id]}</td>
                                                    <td className='text-center'>{totalNotApprovePost[user.id]}</td>
                                                    <td className='text-center'><button class="btn btn-success mr-2">Chi tiết</button></td>
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

export default Statistics