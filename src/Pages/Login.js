import React, { useState, useEffect } from 'react'
import { auth, db } from '../config/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { query, getDocs, collection, where } from 'firebase/firestore';
import { saveUserDataToLocalStorage } from '../config/localstorage';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const getUserDataFromFirestore = async (documentId) => {
        try {
            const usersCollectionRef = collection(db, 'Users');
            const q = query(usersCollectionRef, where('__name__', '==', documentId)); // '__name__' là trường đặc biệt trong Firestore đại diện cho ID của tài liệu

            const querySnapshot = await getDocs(q);
            const userData = [];

            querySnapshot.forEach((doc) => {
                userData.push(doc.data());
            });

            if (userData.length > 0) {
                return userData[0]; // Trả về tài liệu đầu tiên (giả sử chỉ có một tài liệu khớp)
            } else {
                console.log('Không tìm thấy thông tin người dùng trong Firestore');
                return null;
            }
        } catch (error) {
            console.log('Lỗi khi lấy dữ liệu người dùng từ Firestore:', error);
            return null;
        }
    };

    const signIn = (e) => {
        e.preventDefault();
        if (email !== '' && password !== '' ) 
        {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;

                    // Lấy dữ liệu người dùng từ Firestore
                    getUserDataFromFirestore(uid)
                        .then((userData) => {
                            const userDataWithId = { uid, ...userData };
                            console.log(userDataWithId);
                            saveUserDataToLocalStorage(userDataWithId); // Lưu trữ dữ liệu người dùng vào Local Storage
                            localStorage.setItem('isLoggedIn', 'true');

                            if (rememberMe) {
                                localStorage.setItem('rememberMeEmail', email);
                                localStorage.setItem('rememberMePassword', password);
                            } else {
                                localStorage.removeItem('rememberMeEmail');
                                localStorage.removeItem('rememberMePassword');
                            }
                            navigate('/statistics');
                        })
                        .catch((error) => {
                            console.log('Lỗi khi lấy dữ liệu người dùng từ Firestore:', error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                    if(error.code == 'auth/invalid-credential')
                    {
                        console.log('Tài khoản không tồn tại hoặc thông tin không hợp lệ');
                    }
                });
        }
        else
        {
            console.log("Vui lòng nhập đầy đủ thông tin")
            return;
        }
    };

    useEffect(() => {
        const rememberMeEmail = localStorage.getItem('rememberMeEmail');
        const rememberMePassword = localStorage.getItem('rememberMePassword');

        if (rememberMeEmail && rememberMePassword) {
            setEmail(rememberMeEmail);
            setPassword(rememberMePassword);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={signIn}>
                    <h3>Sign In</h3>

                    <div className="mb-3">
                        <label>Email address</label>
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

                    <div className="mb-3">
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck1"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label className="custom-control-label" htmlFor="customCheck1">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary col-md-12">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        <p>Don't you have account ? <Link to='/signup'>Sign Up</Link></p>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login