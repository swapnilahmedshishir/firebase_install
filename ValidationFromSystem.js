//Note : frist install a firebase app : npm install firebase

import React, { useState } from "react";
import "./App.css";

//Firebase and Cloud Firestore amd app Object.
import { getFirestore} from "firebase/firestore/lite";
import { initializeApp } from "firebase/app";
// authenticate google provider
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword
} from "firebase/auth";

//import from firebseConfig in another functon :
import firebaseConfig from "./firebaseConfig";

//config app
const app = initializeApp(firebaseConfig);
 getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

function App() {
  const [newUser, setNewUser]= useState(false);
  const [user, setUser] = useState({
    singIN: false,
    name: "",
    email: "",
    image: "",
  });

  const singInBtn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const { uid, email, displayName, photoURL } = res.user;
        const UserInfo = {
          singIN: true,
          name: displayName,
          email: email,
          image: photoURL,
        };
        setUser(UserInfo);
        console.log(uid, email, displayName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const singOutBtn = () => {
    signOut(auth)
      .then((res) => {
        const singOutUser = {
          singIN: false,
          name: "",
          email: "",
          image: "",
          password: "",
          error:'',
          success : false
        };
        setUser(singOutUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //from validation work
  const authValid = (e) => {
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const userInfo = {...user}; 
          userInfo.success = true;
          userInfo.error = '';        
          setUser(userInfo)
        })
        .catch((error) => {
          const userInfo = {...user};
          userInfo.error = error.code;
          userInfo.success = false;
          setUser(userInfo)
          
        });
    }
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const userInfo = {...user}; 
          userInfo.success = true;
          userInfo.error = '';        
          setUser(userInfo)
          
        })
          .catch((error) => {
            const userInfo = {...user};
          userInfo.error = error.code;
          userInfo.success = false;
          setUser(userInfo)
           
          });
    }
    e.preventDefault();
  };

  const valueGenarate = (e) => {
    let validationCheck = true;
    if (e.target.name === "email") {
      validationCheck =
        /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(
          e.target.value
        );
    }
    if (e.target.name === "password") {
      const PassWordValidation = e.target.value.length > 8;
      const GenarteNumberPsw = /\d{1}/.test(e.target.value);
      validationCheck = PassWordValidation && GenarteNumberPsw;
    }

    if (validationCheck) {
      const userInfo = { ...user };
      userInfo[e.target.name] = e.target.value;
      setUser(userInfo);
    }
  };

  return (
    <div className="App">
      {user.singIN ? (
        <button onClick={singOutBtn}>Sign Out</button>
      ) : (
        <button onClick={singInBtn}>Sign In</button>
      )}
      {user.singIN === true && (
        <div>
          <p> user name : {user.name}</p>
          <p> user email : {user.email}</p>
          <img src={user.image} alt="" />
        </div>
      )}
      <br />
      <br />
      <h1>Validation Atintiquation</h1>
      <div>
        <p>Username : {user.username}</p>
        <p>Email : {user.email}</p>
        <p>password : {user.password}</p>
      </div>
      <form onSubmit={authValid}>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" />
        <label>SING UP  </label><br/>
        {newUser && 
          <input
          type="text"
          onBlur={valueGenarate}
          name="username"
          placeholder="Enter Your Username"
          required
        />
        }
        <br />
        <input
          type="text"
          onBlur={valueGenarate}
          name="email"
          placeholder="Enter Your Email"
          required
        />
        <br />
        <input
          type="password"
          onBlur={valueGenarate}
          name="password"
          placeholder="Enter password"
          required
        />
        <br />
        <input type="submit" value="submit" />
      </form>

      { user.success && true ? <p style={{color:'green'}}>{newUser && true ? "SING UP" : "SING IN "} SuccessFully</p> :
      <p style={{color:'red'}}>{user.error}</p>


      }
    </div>
  );
}

export default App;
