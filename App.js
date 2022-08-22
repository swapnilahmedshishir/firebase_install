//Note : frist install a firebase app : npm install firebase 

import React,{useState} from 'react';
import './App.css';

//Firebase and Cloud Firestore amd app Object.
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
// authenticate google provider
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

//import from firebseConfig in another functon : 
import firebaseConfig from './firebaseConfig';


//config app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

function App() {
  
    const [user, setUser] = useState({
      singIN :false,
      name :"",
      email :"",
      image :""
    });

    const singInBtn = () =>{
      signInWithPopup(auth, provider)
      .then(res => {
        const {uid, email , displayName,photoURL} = res.user;
        const UserInfo = {
          singIN:true,
          name:displayName,
          email:email,
          image:photoURL
        };
        setUser(UserInfo)
        console.log(uid, email , displayName);
      })
      .catch(err => {
          console.log(err);
      })
    }

   const singOutBtn = () => {
    signOut(auth)   
    .then(res => {
      const singOutUser = {
        singIN :false,
       name :"",
      email :"",
      image :""
      };
      setUser(singOutUser)
    })
    .catch(err =>{
      console.log(err);
    })
   };


  return (
    <div >
      { user.singIN  ? <button onClick={singOutBtn}>Sign Out</button> :
        <button onClick={singInBtn}>Sign In</button>
    }
      {
        user.singIN === true && <div>
          <p> user name : {user.name}</p>
          <p> user email : {user.email}</p>
          <img src={user.image} alt=''/>
        </div>
      }
    </div>
  );
}

export default App;
