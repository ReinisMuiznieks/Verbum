import React from "react";
import "./login.scss";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavbarTop from "../../components/navbar/navbar.jsx";
import Footer from "../../components/footer/footer.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import image from '../../images/login_image.svg'

import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../../features/auth/authSlice'

function Login() {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    })
  
    const { email, password } = formData
  
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const { user, isError, isSuccess, message } = useSelector(
      (state) => state.auth
    )
  
    useEffect(() => {
      if (isError) {
        toast.error(message)
      }
  
      if (isSuccess || user) { // doesnt allow to access /log-in anymore when logged in
        navigate('/')
      }
  
      dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])
  
    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }))
    }
  
    const onSubmit = (e) => {
      e.preventDefault()
  
      const userData = {
        email,
        password,
      }
  
      dispatch(login(userData))
    }

    return (
<><NavbarTop/>

<Container id="login-container">
    <Row className="full-form">
        <Col>
        <img src={image} alt="log-in" id="login-image"></img>
        
        </Col>

        <Col>
            <Form id="login-form" onSubmit={onSubmit}>
                <h3 id="form-title" className="text-center">Login</h3>  {/* Pieslēgšanās */}
                <div className="text-center">Not registered?{" "} {/* Vēl neesiet reģistrēti */}
                    <a className="link-primary" id="login-href" href="/sign-up">Register</a> {/* Reģistrēties */}
                </div>

                <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label> {/* E-pasts */}
                <div className='form-group'>
                <input
                    type='email'
                    className='form-control'
                    id='email'
                    name='email'
                    value={email}
                    placeholder='Enter email' /* Ievadiet e-pastu */
                    onChange={onChange}
                />
                </div>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label> {/* Parole */}
                <div className='form-group'>
                <input
                    type='password'
                    className='form-control'
                    id='password'
                    name='password'
                    value={password}
                    placeholder='Enter password' /* Ievadiet paroli */
                    onChange={onChange}
                />
                </div>
                </Form.Group>

                <Button variant="primary" type="submit" id="submit-form">Login</Button> {/* Pieslēgties */}
                <p className="text-center mt-2">Forgot <a href="/forgot-password">password?</a></p> {/* Aizmirsāt paroli? */}
            </Form>
        </Col>
    </Row>
</Container>

<Footer/></>
)
}

export default Login;