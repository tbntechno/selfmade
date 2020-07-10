import React from "react";
import { Route, Redirect }  from "react-router-dom";
import firebase from "../../services/firebase";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const user = firebase.auth().currentUser;
  return (
    <Route
      {...rest}
      render={props => {
        if (!user)
          return <Redirect to={{pathname: "/",state: { from: props.location } }}/>
        else
          return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
