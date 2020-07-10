import React from 'react';
import './Home.scss';
//Components
import Login from './Login/Login';
// 
import firebase from "../../services/firebase";
import { Redirect }       from "react-router-dom";

const Home = () => {
  const user = firebase.auth().currentUser;
  if (user) return <Redirect to="/dictionary" />;
  return (
    <div className="container-fluid">
      <div className="main row no-gutter">
        <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
        <div className="col-md-8 col-lg-6">
          <div className="py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-9 col-lg-8 mx-auto">
                  <h3 className="login-heading mb-4">Welcome back!</h3>
                  <Login/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home;