// NotFound.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const NotFound = () => {
    return (
        <Container className="my-5">
            <Row>
                <Col md={12}>
                    <Card className="text-center p-4 shadow-sm">
                        <h2>404 - Page Not Found</h2>
                        <p>Sorry, the page you are looking for does not exist.</p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;
