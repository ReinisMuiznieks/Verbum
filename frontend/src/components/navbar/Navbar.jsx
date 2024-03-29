import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import './navbar.scss'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../../features/auth/authSlice'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';

function NavbarTop() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isAdmin, setIsAdmin] = useState(false);

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  useEffect(() => {
    checkRole();
  })

  // pārbaudīt vai lietotājs ir administrators
  const checkRole = () => {
      if(user && user.role === 'admin'){
      setIsAdmin(true)
    }
    else{
      setIsAdmin(false)
    }
  }

  return (    
<>
        <Navbar expand="md">
          <Container>
            <Navbar.Brand href="/" id="nav-brand">Verbum</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`}/>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-md`}
              aria-labelledby={`offcanvasNavbarLabel-expand-md`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                  Verbum
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="side-nav">
                <Nav className="justify-content-start flex-grow-1">
                  <Nav.Link href="/" id="nav-link">Home</Nav.Link>
                  {user ? (
                    <>
                    <Nav.Link href="/learn" id="nav-link">Learn</Nav.Link>
                    <Nav.Link href="/test" id="nav-link">Test</Nav.Link>
                    </>
                  ) : (
                    <>
                    </>   
                  )}
                  {isAdmin ? (
                    <>
                    <Nav.Link href="/admin" id="nav-link">Admin</Nav.Link>
                    </>
                  ) : (
                    <>
                    </>   
                  )}   
                </Nav>
                  {user ? (
                    <>
                    <NavDropdown title={user.name} id={`offcanvasNavbarDropdown-expand-md`} className="profile-dropdown">
                    <NavDropdown.Item href="/tests">Test History</NavDropdown.Item>
                      <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    </>
                  ) : (
                    <><Button variant="outline-secondary" id="nav-btn" href="/sign-up">Register</Button><Button variant="outline-secondary" id="nav-btn" href="/log-in">Login</Button></>   
                  )}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
    // <Navbar expand="md">
    //   <Container>
    //     <Navbar.Brand href="/" id="nav-brand">Verbum</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="navbarScroll">
    //     <Nav >
            // <Nav.Link href="/" id="nav-link">Home</Nav.Link>
            // {user ? (
            //   <>
            //   <Nav.Link href="/learn" id="nav-link">Learn</Nav.Link>
            //   <Nav.Link href="/test" id="nav-link">Test</Nav.Link>
            //   </>
            // ) : (
            //   <>
            //   </>   
            // )}
            // {isAdmin ? (
            //   <>
            //   <Nav.Link href="/admin" id="nav-link">Admin</Nav.Link>
            //   </>
            // ) : (
            //   <>
            //   </>   
            // )}         
    //     </Nav>
    //     <Nav className="ms-auto">
    //       {user ? (
    //         <>
    //         <NavDropdown title={user.name} id="nav-dropdown" className="profile-dropdown">
    //         <NavDropdown.Item href="/tests">Test History</NavDropdown.Item>
    //           <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
    //           <NavDropdown.Divider />
    //           <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
    //         </NavDropdown>
    //         </>
    //       ) : (
    //         <><Button variant="outline-secondary" id="nav-btn" href="/sign-up">Register</Button><Button variant="outline-secondary" id="nav-btn" href="/log-in">Login</Button></>   
    //       )}
    //     </Nav>
    //     </Navbar.Collapse> 
    //   </Container>
    // </Navbar>
  );
}

export default NavbarTop;
