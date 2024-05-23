import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firestore'
import moment from 'moment';
import { addDoc, collection, setDoc, doc, Timestamp } from 'firebase/firestore'

const SignUp = () => {
    const [secretkey, setSecretKey] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const currentDate = moment();
    const dateString = currentDate.format('DD-MM-YYYY');
    const defaultPhoto = 'https://firebasestorage.googleapis.com/v0/b/cookapp-a0614.appspot.com/o/images%2Fdefaultuserimage%2Flogo_user.jpg?alt=media&token=408dfb1f-5c32-4ab0-9bce-8d79790078e5'
    const navigate = useNavigate();

    const signUp = (e) => {
        e.preventDefault();
        if (secretkey !== 'admin1234') {
            console.log('Secretkey không đúng vui lòng thử lại');
            return;
        }
        if (username !== '' && password !== '' && email !== '') {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const uid = user.uid;

                    const userData = {
                        user_name: username,
                        email: email,
                        user_image: defaultPhoto,
                        date_created: Timestamp.fromDate(new Date()),
                        role: true
                    };

                    setDoc(doc(db, 'Users', uid), userData)
                        .then((docRef) => {
                            console.log('Dữ liệu đã được lưu vào Firestore:', docRef);
                            navigate('/login')
                        })
                        .catch((error) => {
                            console.error('Lỗi khi lưu dữ liệu vào Firestore:', error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                    if (error.code === 'auth/weak-password') {
                        console.log('Mật khẩu phải từ 6 ký tự trở lên ')
                    }
                    else if (error.code === 'auth/email-already-in-use') {
                        console.log('Email đã có trong hệ thống')
                    }
                });
        }
        else {
            console.log("Vui lòng nhập đầy đủ thông tin")
            return;
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={signUp}>
                    <h3>Sign Up</h3>
                    <div className="mb-3">
                        <label>Secret Key</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Secret Key"
                            value={secretkey}
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Sign Up
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        Already registered <Link to='/login'>sign in?</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp