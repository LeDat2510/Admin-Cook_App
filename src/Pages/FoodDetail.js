import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../config/firestore';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, onSnapshot} from 'firebase/firestore';
import moment from 'moment';
import { getUserDataFromLocalStorage } from '../config/localstorage';
import { Timestamp } from 'firebase/firestore';

const FoodDetail = () => {

    const { id } = useParams();

    const userData = getUserDataFromLocalStorage();
    const uid = userData ? userData.uid : null;

    const approve = localStorage.getItem('approve')

    const [foodData, setFoodData] = useState([])
    const [userName, setUserName] = useState(null);
    const [nameTypeOfFood, setNameTypeOfFood] = useState('');

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

    const getNameTypeOfFood = async (id) => {
        try {
            const tofQuery = query(collection(db, 'FoodCategories'), where('__name__', '==', id));
            const tofQuerySnapshot = await getDocs(tofQuery);
            if (!tofQuerySnapshot.empty) {
                const tofData = tofQuerySnapshot.docs[0].data();
                return tofData.categories_name;
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const addToApproveFood = async() => {
        try {
            const approvedData = {
                id_user: uid,
                id_food: id,
                date_add: Timestamp.fromDate(new Date()),
            }
            await addDoc(collection(db, 'ApproveFoods'), approvedData);
            console.log('Dữ liệu đã được thêm vào bảng duyệt thành công');
            const foodRef = doc(db, 'Foods', id);
            await updateDoc(foodRef, { status: 'Approve'})
            console.log('Trạng thái của bản ghi Mon_an đã được cập nhật thành công');
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu vào bảng duyệt:', error);
        }
    }

    const addToNotApproveFood = async() => {
        try {
            const NotapprovedData = {
                id_user: uid,
                id_food: id,
                date_add: Timestamp.fromDate(new Date()),
            }
            await addDoc(collection(db, 'NotApproveFoods'), NotapprovedData);
            console.log('Dữ liệu đã được thêm vào bảng không duyệt món ăn');
            const foodRef = doc(db, 'Foods', id);
            await updateDoc(foodRef, { status: 'Not Approve'})
            console.log('Trạng thái của bản ghi Mon_an đã được cập nhật thành công');
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu vào bảng duyệt:', error);
        }
    }

    const deleteFood = async(foodId) => {
        try 
        {
            const foodRef = doc(db, 'Foods', foodId)
            const foodSnapShot = await getDoc(foodRef);

            if(foodSnapShot.exists)
            {
                const foodData = foodSnapShot.data();
                const status = foodData.status;

                if(status === "Approve")
                {
                    const approveFoodQuery = query(collection(db, 'ApproveFoods'), where('id_food', '==', foodId));
                    const approveFoodSnapshot = await getDocs(approveFoodQuery);
                    approveFoodSnapshot.forEach(async (doc) => {
                      await deleteDoc(doc.ref);
                    });
                }
                else 
                {
                    const notApproveFoodQuery = query(collection(db, 'NotApproveFood'), where('id_food', '==', foodId));
                    const notApproveFoodSnapshot = await getDocs(notApproveFoodQuery);
                    notApproveFoodSnapshot.forEach(async (doc) => {
                      await deleteDoc(doc.ref);
                    });
                }
            }
            await deleteDoc(foodRef);
            console.log('Món ăn đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi xóa món ăn:', error);
        }
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'Foods'), where('__name__', '==', id)), 
        async(snapShot) => {
            const foodData = snapShot.docs[0].data();
            if(!foodData.empty)
            {
                setFoodData(foodData);
                const userName = await getUserName(foodData.user_id);
                setUserName(userName);
                const nameTypeOfFood = await getNameTypeOfFood(foodData.categories_id);
                setNameTypeOfFood(nameTypeOfFood)
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
                                        <img src={foodData.food_image} style={{ width: '100%', height: 'auto', objectFit: 'contain', margin: '20px 10px' }}></img>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Tên người đăng: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={userName} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Tên món: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.food_name} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Tên loại món: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={nameTypeOfFood} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Nguyên liệu: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.ingredient} />
                                        </div>
                                        <div class="form-group">
												<label for="tutorial">Nội dung hướng dẫn</label>
												<textarea class="form-control" id="tutorial" rows="5" value={foodData.tutorial} disabled>
												</textarea>
											</div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Độ khó: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.difficulty} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Lượng calo: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.calories} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Suất ăn: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.size} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Thời gian nấu: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.time_to_cook} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="disableinput">Ngày đăng: </label>
                                            <input type="text" className="form-control wide-input" id="disableinput" placeholder="Enter Input" disabled value={foodData.date_posted ? moment(foodData.date_posted.toDate()).format('DD/MM/YYYY') : ''} />
                                        </div>
                                        
                                            {
                                                approve === 'true' ? (
                                                    <div className="card-action">
                                                         <Link to='/approvefood' className="btn btn-success mr-2" onClick={addToApproveFood}>Duyệt</Link>
                                                         <Link to='/approvefood' className="btn btn-danger" onClick={addToNotApproveFood}>Không duyệt</Link>
                                                    </div>
                                                ): (
                                                    <div className="card-action">
                                                        <Link to='/managefood' class="btn btn-danger" onClick={() => deleteFood(id)}>Xóa</Link>
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

export default FoodDetail