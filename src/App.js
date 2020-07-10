import React, { useState } from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
// Bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
// QuillJS
import 'react-quill/dist/quill.snow.css';
// React Dom
import {BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// Firebase
import firebase from './services/firebase';
// Components
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// Pages
import Home       from './pages/Home/Home';
import Register   from './pages/Register/Register';
import Dictionary from './pages/Dictionary/Dictionary';
import Diet       from './pages/Diet/Diet';
import Test       from './pages/Test/Test';

// Components
import Nav      from './components/Nav/Nav';
import Logout   from './components/Logout/Logout';

// Services
import { AuthProvider } from "./services/auth";
 

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav/>
        <Switch>
          <Route          path = "/" exact      component={Home}/>
          <Route          path = "/register"    component={Register}/>
          <Route          path = "/test"        component={Test}/>
          <ProtectedRoute path = "/logout"      component={Logout}/>
          <ProtectedRoute path = "/dictionary"  component={Dictionary}/>
          <ProtectedRoute path = "/diet"        component={Diet}/>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
