import { useEffect, useState } from 'react';
import { Row, Col, Card, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function PacksCard(props) {




    return (
        <div>




        <Card className='card'>
            <Card.Img variant="top" src={props.img} />


            <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>
                {props.text}
            </Card.Text>
            </Card.Body>
        </Card>
      </div>



    )
}