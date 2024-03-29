import React from "react";
import NavbarTop from "../../components/navbar/Navbar.jsx";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './home.scss'
import homeImage from '../../images/home_image.svg'
import { useSelector } from 'react-redux'
import audioImage from '../../images/listen-item-image.svg'
import vocabularyImage from '../../images/vocabulary-item-image.svg'
import trackImage from '../../images/track-item-image.svg'

function Home() {
  const { user } = useSelector((state) => state.auth)

    return (
<>
<NavbarTop />
  <div id="legend">
    <Container>
      <Container>
          <Row>
            <Col lg={6} md={12}>
              <h1 className="title">Learn <span className="gradient-accent">Latvian</span><br></br> Language Online</h1>
              <p className="subtitle">Learn Latvian at the best time for you from anywhere. Expand your vocabulary and measure your knowledge by doing tests & keep track of your progress.</p>
              {user ? (
                        <>
                        <Button variant="outline-secondary" id="get-started-home" href="/learn">Get started</Button>
                        </>
                      ) : (
                        <>
                        <Button variant="outline-secondary" id="get-started-home"  className="login-button"href="/sign-up">Get started</Button>
                        </>
                      )} 
            </Col>
            <Col lg={6} md={12} className="d-none d-md-block d-md-none d-lg-block">
              <img src={homeImage} alt="learning" className="img-fluid"></img>
            </Col>
          </Row>
        </Container>   


          <div className="part-container">
            <Row>
              <Col>
                  <div className="part-item">
                    <img id="item-image" src={vocabularyImage}></img>
                    <div className="part-title">
                      Expands vocabulary
                    </div>
                    <div className="part-text">
                        Expand your word knowledge across various categories that we provide.
                    </div>
                  </div>
              </Col>

              <Col>
                  <div className="part-item">
                    <img id="item-image" src={audioImage}></img>
                    <div className="part-title">
                      Offers audio
                    </div>
                    <div className="part-text">
                      Listen to the each word, learn the pronounciation and try for yourself!
                    </div>
                  </div>
              </Col>

              <Col>
                  <div className="part-item">
                    <img id="item-image" src={trackImage}></img>
                    <div className="part-title">
                      Tracks progress
                    </div>
                    <div className="part-text">
                        Keep track of your learning progress, review your previously completed tests!
                    </div>
                  </div>
              </Col>
            </Row>
          </div>
    </Container>
</div>

</>
        )
}

export default Home;