import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Landing.css';

function Landing({ onLogin }) { // Accept onLogin as a prop
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSignIn, setIsSignIn] = useState(true);
    const navigate = useNavigate();

    // Reset to sign-in on component mount
    useEffect(() => {
        setIsSignIn(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isSignIn ? 'http://localhost:5000/signin' : 'http://localhost:5000/auth';
        const body = isSignIn ? { username, password } : { username, password, email };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || (isSignIn ? "Sign in successful!" : "Sign up successful!"));
                if (isSignIn) {
                    onLogin(); // Call the login handler passed from App.js
                    navigate('/welcome'); // Redirect to welcome page after sign-in
                }
            } else {
                setMessage(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            console.error(error);
        }
    };

    return (
        <Container className="mt-5">
            <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
            {message && <Alert variant={isSignIn ? "info" : "success"}>{message}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {!isSignIn && (
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}

                <Button variant="primary" type="submit">
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                </Button>
            </Form>
            <Button variant="link" onClick={() => setIsSignIn(!isSignIn)}>
                {isSignIn ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Button>
        </Container>
    );
}

export default Landing;