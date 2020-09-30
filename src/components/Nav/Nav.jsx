import React,{useState, useContext}   from "react";
import { AuthContext }          from "services/auth";
import { Navbar, Nav as BSNav } from 'react-bootstrap';

import './Nav.scss';
const Nav = () => {
  const {currentUser} = useContext(AuthContext)
  return(
    <Navbar className="my-navbar" variant="dark">
      <Navbar.Brand href="/diet">Diet Plan</Navbar.Brand>
      {currentUser && (<>
          <BSNav className="mr-auto">
            <BSNav.Link href="#home">Home</BSNav.Link>
            <BSNav.Link href="/meal">Meals</BSNav.Link>
            <BSNav.Link href="/ingredient">Ingredients</BSNav.Link>
          </BSNav>
          <BSNav className="ml-auto">
            <BSNav.Link href="#home">{currentUser.email}</BSNav.Link>
            <BSNav.Link href="/logout">Logout</BSNav.Link>
          </BSNav>
        </>
      )}
    </Navbar>
  )
}
export default Nav;

