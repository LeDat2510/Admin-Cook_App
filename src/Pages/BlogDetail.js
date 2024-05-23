import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../config/firestore';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, onSnapshot} from 'firebase/firestore';
import moment from 'moment';
import { getUserDataFromLocalStorage } from '../config/localstorage';
import { Timestamp } from 'firebase/firestore';

const BlogDetail = () => {

    const { id } = useParams();

    const userData = getUserDataFromLocalStorage();
    const uid = userData ? userData.uid : null;

    const approve = localStorage.getItem('approve')

    const [blogData, setBlogData] = useState([])
    const [userName, setUserName] = useState(null);
    const currentDate = moment();

    const getUserName = async (userId) => {
        try {
            const userQuery = query(collection(db, 'Users'), where('__name__', '==', userId));
            const userQuerySnapshot = await getDocs(userQuery);
            if (!userQuerySnapshot.empty) {
                const userData = userQuerySnapshot.docs[0].data();
                return userData.user_name;
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    };


    const addToApproveBlog = async() => {
        try {
            const approvedData = {
                id_user: uid,
                id_blog: id,
                date_add: Timestamp.fromDate(new Date()),
            }
            await addDoc(collection(db, 'ApproveBlog'), approvedData);
            console.log('Dữ liệu đã được thêm vào bảng duyệt thành công');
            const blogRef = doc(db, 'Blog', id);
            await updateDoc(blogRef, { status: 'Approve'})
            console.log('Trạng thái của bản ghi Mon_an đã được cập nhật thành công');
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu vào bảng duyệt:', error);
        }
    }

    const addToNotApproveBlog = async() => {
        try {
            const approvedData = {
                id_user: uid,
                id_blog: id,
                date_add: Timestamp.fromDate(new Date()),
            }
            await addDoc(collection(db, 'NotApproveBlog'), approvedData);
            console.log('Dữ liệu đã được thêm vào bảng duyệt thành công');
            const blogRef = doc(db, 'Blog', id);
            await updateDoc(blogRef, { status: 'Not Approve'})
            console.log('Trạng thái của bản ghi Mon_an đã được cập nhật thành công');
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu vào bảng duyệt:', error);
        }
    }

    const deleteBlog = async(blogId) => {
        try 
        {
            const blogRef = doc(db, 'Blog', blogId)
            const blogSnapShot = await getDoc(blogRef);

            if(blogSnapShot.exists)
            {
                const blogData = blogSnapShot.data();
                const status = blogData.status;

                if(status === "Approve")
                {
                    const approveBlogQuery = query(collection(db, 'ApproveBlog'), where('id_blog', '==', blogId));
                    const approveBlogSnapshot = await getDocs(approveBlogQuery);
                    approveBlogSnapshot.forEach(async (doc) => {
                      await deleteDoc(doc.ref);
                    });
                }
                else 
                {
                    const notApproveBlogQuery = query(collection(db, 'NotApproveBlog'), where('id_blog', '==', blogId));
                    const notApproveBlogSnapshot = await getDocs(notApproveBlogQuery);
                    notApproveBlogSnapshot.forEach(async (doc) => {
                      await deleteDoc(doc.ref);
                    });
                }
            }
            await deleteDoc(blogRef);
            console.log('Blog đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi xóa Blog:', error);
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'Blog'), where('__name__', '==', id)), 
        async(snapShot) => {
            const blogData = snapShot.docs[0].data();
            if(!blogData.empty)
            {
                setBlogData(blogData);
                const userName = await getUserName(blogData.id_user);
                setUserName(userName);
            }
        });
        
        return () => {
            unsubscribe();
        }
    }, [id])

    return (
        <div class="content">
            <div className="container-fluid">
                <h4 className="page-title">Chi tiết bài đăng</h4>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Thông tin</div>
                            </div>
                            <div className="card-body">
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <img src={blogData.blog_image} style={{ width: '100%', height: 'auto', objectFit: 'contain', margin: '20px 10px' }}></img>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Tên người đăng: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={userName} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Tiêu đề blog: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={blogData.title_blog} />
                                        </div>
                                        <div class="form-group">
												<label for="tutorial">Nội dung Blog: </label>
												<textarea class="form-control" id="tutorial" rows="5" value={blogData.blog_content} disabled>
												</textarea>
											</div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Ngày đăng: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={blogData.date_posted ? moment(blogData.date_posted.toDate()).format('DD/MM/YYYY') : ''} />
                                        </div>
                                            {
                                                approve === 'true' ? (
                                                    <div className="card-action">
                                                         <Link to='/approveblog' className="btn btn-success mr-2" onClick={addToApproveBlog}>Duyệt</Link>
                                                         <Link to='/approveblog' className="btn btn-danger" onClick={addToNotApproveBlog}>Không duyệt</Link>
                                                    </div>
                                                ) : (
                                                    <div className="card-action">
                                                        <Link to='/manageblog' class="btn btn-danger" onClick={() => deleteBlog(id)}>Xóa</Link>
                                                     </div>
                                                )
                                            }           
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default BlogDetail