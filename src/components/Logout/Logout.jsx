import firebase from "../../services/firebase";

const Logout = () => {
  firebase.auth().signOut();
  window.location = "/";
  return null;
}

export default Logout;