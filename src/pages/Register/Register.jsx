import React, { useCallback } from "react";
import { withRouter } from "react-router";
import firebase from "../../services/firebase";

const Register = ({ history }) => {
  /* useCallback explained:
    In a Class/Classes React component
    All methods, function inside that component is re-created whenever a react component is re-render
    => useCallBack to Keep track of & change current function but not the others
    Example:
    // without  : handleSetAge is called => the other is re-created
    const handleSetHeight = () => setHeight(height + 10)
    const handleSetAge = () => setAge(age + 1)
    // with     : handleSetAge is called => the other didn't get re-created
    const handleSetHeight = useCallback(() => setHeight(height + 10), [height])
    const handleSetAge = useCallback(() => setAge(age + 1), [age]),
    ** the second parameter []: is to track the trigger factor => if whatever inside [] is changed during the re-reder
    => A new function instance will be generated
    => It's completely useless here!!
  */
  const handleRegister = useCallback(async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
      alert("Account created Succesfully");
      history.push("/private");
    } catch (error) {
      alert(error);
    }
  }, [history]);

  return (
    <div>
      <h1>Sign up</h1>
      <form>
        <label>
          Email
          <input name="email"     type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password"  type="password" placeholder="Password" />
        </label>
        <button type="submit" onClick={handleRegister}>Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(Register);