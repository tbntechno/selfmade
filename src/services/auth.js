import React, { useEffect, useState } from "react";
import firebase from "./firebase";

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // the usage is ONLY for the Navbar (cuz u can call auth anytime)
  const [pending, setPending]         = useState(true);
  
  /*
    We Want to use Effect here because we want to verify user after we render everything once
    Why Dont we verifying BEFORE everything re-render?
      - MAYBE because Render Elements could be related to the some data
  */
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if(pending) return <>Loading...</>

  return (
    <AuthContext.Provider value={{currentUser}} >
      {children}
    </AuthContext.Provider>
  );
};