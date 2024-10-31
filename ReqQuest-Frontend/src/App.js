import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import ReactJson from 'react-json-view';  
import './App.css'; 
import logo from './assests/logo.svg'; 

function App() {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState('');
    const [body, setBody] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null); 
        let parsedHeaders = {};
        let parsedBody = {};

        try {
            parsedHeaders = headers ? JSON.parse(headers) : {};
            parsedBody = body ? JSON.parse(body) : {};
        } catch (parseError) {
            setResponse({ error: 'Headers and Body must be valid JSON objects' });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('https://reqquest-backend.onrender.com/api/test', {
                url,
                method,
                headers: parsedHeaders,
                body: parsedBody
            });
            setResponse(response.data);
        } catch (error) {
            console.error("Request failed:", error); 
            setResponse(error.response ? error.response.data : { error: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setUrl('');
        setMethod('GET');
        setHeaders('');
        setBody('');
        setResponse(null);
    };

    const handleDownload = () => {
        if (!response) return;

        const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Response.json'; 
        a.click();
        window.URL.revokeObjectURL(url); 
    };

    return (
        <Container className="my-4">
            <Row>
                {/* Request Form Column */}
                <Col md={12} className="mb-4">
                    <Card className="p-4 shadow-sm">
                        <h2 className="text-center">
                            <img src={logo} alt="ReqQuest Logo" style={{ width: '50px', marginBottom: '5px', marginRight:'5px' }} />
                            ReqQuest
                        </h2>
                        <p className="text-center lead">
                          <b>Your Ultimate Companion for a Seamless API Testing Journey</b> 
                        </p>
                        <p className="text-center text-muted">
                            No signup required, it's free! No credit card needed.
                        </p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUrl">
                                <Form.Label>URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter API URL"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formMethod" className="mt-3">
                                <Form.Label>HTTP Method</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formHeaders" className="mt-3">
                                <Form.Label>Headers (JSON format)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder='{"Content-Type": "application/json"}'
                                    value={headers}
                                    onChange={(e) => setHeaders(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBody" className="mt-3">
                                <Form.Label>Body (JSON format)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder='{"key": "value"}'
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" className="mt-4 w-100" disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Send Request'}
                            </Button>
                            <Button variant="danger" onClick={handleClear} className="mt-3 w-100">
                                Clear
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    {response && (
                        <Card className="p-4 shadow-sm">
                            <h3 className="text-center">Response</h3>
                            <div className="response-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <h5>Status: {response.status || 'N/A'}</h5>
                                <h5>Headers:</h5>
                                <ReactJson src={response.headers || {}} theme="nord" collapsed={false} />
                                <h5>Body:</h5>
                                <ReactJson src={response.body || response} theme="nord" collapsed={false} />
                            </div>
                            <Button variant="success" onClick={handleDownload} className="mt-3 w-100">
                                Download Data
                            </Button>
                        </Card>
                    )}
                    {loading && (
                        <div className="text-center my-3">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    )}
                </Col>
            </Row>

            <footer className="text-center mt-4">
                <img src='https://www.svgrepo.com/show/367180/req.svg' alt="ReqQuest Logo" style={{ width: '30px', marginBottom: '5px', marginRight:'5px' }} />
                <p>&copy; {new Date().getFullYear()} ReqQuest. All rights reserved.</p>
            </footer>
        </Container>
    );
}

export default App;
