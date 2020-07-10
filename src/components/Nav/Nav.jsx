import React, { useContext }    from "react";
import firebase                 from "../../services/firebase";
import { AuthContext }          from "../../services/auth";
import './Nav.scss';
const Nav = () => {
  const { currentUser } = useContext(AuthContext); // THIS is for update NAV bar React STATE!
  const user            = firebase.auth().currentUser;

  return(
    <nav className="navbar navbar-expand-lg navbar-dark">
      <a className="navbar-brand" href="#">My Dictionary</a>
      {/* <Link to="/"><img src={Logo} alt="logo" width='80px' /></Link> */}
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div  className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {currentUser && (
            <React.Fragment>
              <li className="nav-item"><a className="nav-item nav-link" href="#">{user.email}</a></li>
              <li className="nav-item"><a className="nav-item nav-link" href="/logout">Logout</a></li>
            </React.Fragment>  
          )}
        </ul>
        {/* <form className="form-inline my-2 my-lg-0">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form> */}
      </div>
    </nav>
  )
}
export default Nav;