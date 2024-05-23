// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCioNDGuDWJBUwLIeNFMql2VlCMCodj85A",
  authDomain: "cookapp-a0614.firebaseapp.com",
  projectId: "cookapp-a0614",
  storageBucket: "cookapp-a0614.appspot.com",
  messagingSenderId: "656713590988",
  appId: "1:656713590988:web:9fe867b922bb3d156eba69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const storage = getStorage(app);
