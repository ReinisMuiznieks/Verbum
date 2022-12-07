import React from "react";
import './category.scss';
import NavbarTop from "../../components/navbar/navbar.jsx";
import Footer from "../../components/footer/footer.jsx";
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';

const Category = () => {
    return (
<>
<NavbarTop />
  <div id="learn-legend">
    <Container>
        <h1 className="text-center">A1 Līmenis</h1>
          {/* <Flashcard></Flashcard> */}
        <Stack id="learn-stack">
            <Card id="stack-card">
                <Card.Body id="stack-chapter">1. Nodaļa</Card.Body>
                <Card.Body id="stack-title">Iepazīšanās</Card.Body>
                <a href="/" class="btn btn stretched-link">Go somewhere</a>
            </Card>
        </Stack>
    </Container>
</div>
<Footer />
</>
    )
}

export default Category;