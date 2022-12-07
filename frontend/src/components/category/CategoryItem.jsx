import { useDispatch } from 'react-redux'
import { deleteCategory } from '../../features/category/categorySlice'
import React from "react";
import '../../pages/category/category.scss';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

function CategoryItem({category, length}) {
    // const dispatch = useDispatch()

  return (
    // <div className="category">
    //     <h2>{category.name}</h2>
    //     <button onClick={() => dispatch(deleteCategory(category._id))}className="close">Delete</button>
    // </div>

<>
  <div id="learn-legend">
    <Container>
        <Stack id="learn-stack">
            <Card id="stack-card">
                <Card.Body id="stack-chapter">{category.name}</Card.Body>
                {/* <Card.Body id="stack-title">Iepazīšanās</Card.Body> */}
                {/* <button onClick={() => dispatch(deleteCategory(category._id))}className="close">Delete</button> */}
                <Link to={`/category/${category._id}`}><div>Preview</div></Link>
            </Card> 
        </Stack>
    </Container>
</div>
</>
  )
}

export default CategoryItem