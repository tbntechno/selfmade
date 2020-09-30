import React, { useState } from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// React-Toastify
import 'react-toastify/dist/ReactToastify.css'

// React Dom
import {BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// Firebase
import firebase from './services/firebase';
// Components
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// Pages
import Home             from './pages/Home/Home';
import Register         from './pages/Register/Register';
import Diet             from './pages/Diet/Diet';
import Ingredient       from './pages/Ingredient/Ingredient';
import Meal             from './pages/Meal/Meal';
import Test             from './pages/Test/Test';

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
          <Route          path = "/ingredient"  component={Ingredient}/>
          <Route          path = "/meal"        component={Meal}/>
          <Route          path = "/test"        component={Test}/>
          <ProtectedRoute path = "/logout"      component={Logout}/>
          <ProtectedRoute path = "/diet"        component={Diet}/>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
