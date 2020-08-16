import React, {useState}  from 'react';
import { withRouter }     from "react-router-dom";
import Joi                from '@hapi/joi';
import firebase           from "../../../services/firebase";
import './Login.scss';


const Login = ({ history }) => {
  const [account, setAccount]       = useState({username:'', password:''});
  const [joiErrors, setJoiErrors]   = useState({username:'', password:''});
  const [loginError, setLoginError] = useState("");

  // Login Schema
  const schema = {
    username: Joi.string()
      .required()
      .min(6)
      .max(255)
      .label("Username"),
    password: Joi.string()
      .required()
      .min(6)
      .max(255)
      .label("Password")
  }
  
  // Joi Validation
  const  joiValidate = (resolve, reject) => {
    const tempErrors = {...joiErrors};
    Object.keys(tempErrors).forEach(k => tempErrors[k] = "");  // empty errors

    const JoiSchema = Joi.object().keys(schema);  // Implement Schema with JOI
    const {error}   = JoiSchema.validate(account, { abortEarly: false });   // Validating
    // Handle Errors
    if(error === undefined){ // NO Errors
      setJoiErrors(tempErrors);
      resolve();
    }
    else  {                  // Errors
      error.details.forEach(function({context:{key}, message}){  // Format errors from JOI object
        message = message.replace(/["']/g, "");
        tempErrors[key] = message; 
      });
      setJoiErrors(tempErrors);
      reject();
    }
  }
  // Handlers
  const handleSubmit = async (e) => {
    setLoginError("");
    e.preventDefault();   
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(account.username, account.password);
      history.push("/dictionary");
    } catch (error) {
      alert(error);
    }
  }
  const handleSubmitEnter = (e) =>{
    if(e.key === 'Enter') handleSubmit();
  }
  const handleChange = ({currentTarget: {name, value}}) => {
    const temp = {...account}
    temp[name] = value;
    setAccount(temp);
  }

  return (
    <form className="login">
      <div className="form-label-group">
        <input type="email" id="inputEmail" className="form-control" placeholder="Username" required autoFocus
          name="username"
          onChange = {handleChange}/>
        <label htmlFor="inputEmail">Username</label>
      </div>
      <div className="joi-login-error">{joiErrors.username}</div>
      <div className="form-label-group">
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required
          name="password"
          onChange = {handleChange}/>
        <label htmlFor="inputPassword">Password</label>
      </div>
      <div className="joi-login-error" key={joiErrors.password} >{joiErrors.password.length >= 1 ? (joiErrors.password): ""}</div>
      <div className="server-login-error">{loginError}</div>
      <div className="custom-control custom-checkbox mb-3">
        <input type="checkbox" className="custom-control-input" id="customCheck1"/>
        <label className="custom-control-label" htmlFor="customCheck1">Remember password</label>
      </div>
      <button className="btn btn-lg btn-block btn-login text-uppercase font-weight-bold mb-2" onClick={handleSubmit} onKeyDown={handleSubmitEnter}>Sign in</button>
      <div className="text-center">
        <a className="small" href="#">Forgot password?</a>
      </div>
    </form>
  )
}
export default withRouter(Login);