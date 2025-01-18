import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './Landing'; // Adjust the path as necessary
import Welcome from './Welcome';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing onLogin={handleLogin} />} />
                <Route path="/welcome" element={isAuthenticated ? <Welcome /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;