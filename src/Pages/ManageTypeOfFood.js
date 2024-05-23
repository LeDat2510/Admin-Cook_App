
import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where, onSnapshot, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../config/firestore';

const ManageTypeOfFood = () => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [nameTypeOfFood, setNameTypeOfFood] = useState('');
    const [temporaryURL, setTemporaryURL] = useState(null);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [editingTypeOfFood, setEditingTypeOfFood] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState(false);

    const [typeoffood, setTypeOfFood] = useState([]);

    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage] = useState(3);

    const filteredTypeOfFood = typeoffood.filter((tof) => {
        return (
            search.toLowerCase() === '' ||
            tof.categories_name.toLowerCase().includes(search)
        );
    });

    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const records = filteredTypeOfFood.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredTypeOfFood.length / rowsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    const handleSearchChange = (event) => {
        setSearch(event.target.value.toLowerCase());
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
        const npage = Math.ceil(filteredTypeOfFood.length / rowsPerPage);
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    }

    const deleteTypeOfFood = async (tofId) => {
        try {
            const foodRef = doc(db, 'FoodCategories', tofId)
            const foodSnapShot = await getDoc(foodRef);

            if (foodSnapShot.exists) {
                await deleteDoc(foodRef);
                console.log('Loại món đã được xóa thành công!');
            }
            else {
                console.log('Không tìm thấy loại món để xóa!');
            }
        } catch (error) {
            console.error('Lỗi xóa món loại món:', error);
        }
    }

    const selectTypeOfFood = (tof) => {
        setEditingTypeOfFood(tof);
        setNameTypeOfFood(tof.categories_name);
        setImageURL(tof.categories_image);
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'FoodCategories'),
            async (snapshot) => {
                const TofData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTypeOfFood(TofData);
            }
        );
        return () => {
            unsubscribe(); 
        };
    }, []);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            const fileType = file.type;

            if (!allowedTypes.includes(fileType)) {
                return;
            }

            setSelectedImage(file);

            if (temporaryURL) {
                URL.revokeObjectURL(temporaryURL);
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setTemporaryURL(base64String);
                setImageURL(base64String);
            };
            reader.readAsDataURL(file);
            setIsImageSelected(true);
            setIsImageChanged(true)
        } else {
            setSelectedImage(null);
            setImageURL(null);
            setTemporaryURL(null);
            setIsImageSelected(false);
            setIsImageChanged(false)
        }
    };

    const addTypeOfFood = async () => {
        if (!isImageSelected) {
            console.log('Định dạng tệp không hợp lệ. Vui lòng chọn một tệp hình ảnh.');
            return;
        }
        try {
            const storageRef = ref(storage, 'images/FoodCategories/' + selectedImage.name);
            const uploadTask = uploadBytesResumable(storageRef, selectedImage);
            const snapshot = await uploadTask;

            const downloadURL = await getDownloadURL(snapshot.ref);

            if (nameTypeOfFood === '') {
                console.log("Tên loại món đang trống");
                return;
            }
            await addDoc(collection(db, 'FoodCategories'), { categories_name: nameTypeOfFood, categories_image: downloadURL });
            console.log('Lưu đường dẫn ảnh vào Firestore thành công');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
        setSelectedImage(null);
        setImageURL(null);
        setTemporaryURL(null);
        setIsImageSelected(false);
        setNameTypeOfFood('');
    }

    const updateTypeOfFood = async () => {

        try {
            const typeOfFoodRef = doc(db, 'FoodCategories', editingTypeOfFood.id);
            if (isImageChanged) 
            {
                if (!isImageSelected) {
                    console.log('Định dạng tệp không hợp lệ. Vui lòng chọn một tệp hình ảnh.');
                    return;
                }
                const storageRef = ref(storage, 'images/FoodCategories/' + selectedImage.name);
                const uploadTask = uploadBytesResumable(storageRef, selectedImage);
                const snapshot = await uploadTask;

                const downloadURL = await getDownloadURL(snapshot.ref);

                if (nameTypeOfFood === '') {
                    console.log("Tên loại món đang trống");
                    return;
                }

                await updateDoc(typeOfFoodRef, {
                    categories_name: nameTypeOfFood,
                    categories_image: downloadURL
                })
                console.log("Cập nhật dữ liệu thành công")
                setEditingTypeOfFood(null);
                setSelectedImage(null)
                setNameTypeOfFood('');
                setImageURL(null);
                setTemporaryURL(null);
                setIsImageSelected(false);
                setIsImageChanged(false)
                window.location.reload();
            }
            else {
                if (nameTypeOfFood === '') {
                    console.log("Tên loại món đang trống");
                    return;
                }
                await updateDoc(typeOfFoodRef, {
                    categories_name: nameTypeOfFood,
                    categories_image: imageURL
                })
                console.log("Cập nhật dữ liệu thành công")
                setEditingTypeOfFood(null);
                setSelectedImage(null)
                setNameTypeOfFood('');
                setImageURL(null);
                setTemporaryURL(null);
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const cancelEditing = () => {
        setEditingTypeOfFood(null);
        setNameTypeOfFood('');
        setSelectedImage(null);
        setImageURL(null);
        setTemporaryURL(null);
        setIsImageSelected(false);
        window.location.reload();
    };

    return (
        <div className="content">
            <div className="container-fluid">
                <h4 className="page-title">Quản lý loại món ăn</h4>
                <div className="row">
                    <div className="col-md-5">
                        {
                            editingTypeOfFood ? (
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Sửa loại món</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <input type="file" accept=".png, .jpg, .jpeg" capture="image" onChange={handleImageUpload} />
                                            {isImageSelected ? (
                                                <div>
                                                    <img
                                                        src={imageURL}
                                                        alt="Selected Image"
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            objectFit: 'contain',
                                                            margin: '10px 0px',
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <img
                                                        src={imageURL}
                                                        alt="Selected Image"
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            objectFit: 'contain',
                                                            margin: '10px 0px',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="largeInput">Tên loại món: </label>
                                            <input type="text" className="form-control form-control" id="defaultInput" placeholder="Nhập loại món tại đây..." value={nameTypeOfFood} onChange={(e) => setNameTypeOfFood(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="card-action">
                                        <button className="btn btn-success mr-2" onClick={() => updateTypeOfFood()}>Sửa</button>
                                        <button className="btn btn-danger" onClick={() => cancelEditing()}>Hủy</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Thêm loại món</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <input type="file" accept=".png, .jpg, .jpeg" capture="image" onChange={handleImageUpload} />
                                            {isImageSelected && (
                                                <div>
                                                    <img
                                                        src={imageURL}
                                                        alt="Selected Image"
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            objectFit: 'contain',
                                                            margin: '10px 0px',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="largeInput">Tên loại món: </label>
                                            <input type="text" className="form-control form-control" id="defaultInput" placeholder="Nhập loại món tại đây..." value={nameTypeOfFood} onChange={(e) => setNameTypeOfFood(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="card-action">
                                        <button className="btn btn-success mr-2" onClick={() => addTypeOfFood()}>Thêm</button>
                                        <button className="btn btn-danger" onClick={() => cancelEditing()}>Hủy</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className='col-md-7'>
                        <div class="card">
                            <div class="card-header">
                                <div className="row">
                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                        <div className="card-title">Thông tin loại món</div>
                                    </div>
                                    <div className="col-md-6 col-sm-6 col-xs-6">
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
                            <div class="card-body">
                                <table class="table table-head-bg-primary">
                                    <thead>
                                        <tr>
                                            <th scope="col">STT</th>
                                            <th scope="col">Tên loại món</th>
                                            <th scope="col">Ảnh</th>
                                            <th scope="col">Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.filter((tof) => {
                                            return search.toLowerCase() === '' ? tof :
                                                tof.categories_name.toLowerCase().includes(search)
                                        }).map((tof, index) => (
                                            <tr key={tof.id}>
                                                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                                <td>{tof.categories_name}</td>
                                                <td><img src={tof.categories_image} alt='Picture' style={{ width: '100px', height: '100px' }} /></td>
                                                <td>
                                                    <button class="btn btn-warning mr-2" onClick={() => selectTypeOfFood(tof)}>Sửa</button>
                                                    <button class="btn btn-danger" onClick={() => deleteTypeOfFood(tof.id)}>Xóa</button>
                                                </td>
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

    )
}

export default ManageTypeOfFood