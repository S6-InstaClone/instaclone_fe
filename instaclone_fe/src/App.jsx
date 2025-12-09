import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostFormPage from './components/PostFormPage.jsx';
import Profile from "./Pages/Profile.jsx";
import AuthCallback from "./Pages/AuthCallback.jsx";
import Home from "./Pages/Home.jsx";
import Posts from "./Pages/Posts.jsx";
import { isLoggedIn, simpleLogout } from "./auth";

function App() {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    useEffect(() => {
        // Listen for auth state changes
        const handleAuthChange = () => {
            setLoggedIn(isLoggedIn());
        };

        window.addEventListener("authChange", handleAuthChange);

        // Also check on storage changes (for multi-tab support)
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, []);

    return (
        <Router>
            <nav>
                <Link to="/posts">Posts</Link> | <Link to="/create">Create Post</Link> |{' '}
                {loggedIn && (
                    <>
                        <Link to="/profile">Profile</Link> |{' '}
                        <button onClick={simpleLogout} style={{ cursor: 'pointer' }}>
                            Logout
                        </button>
                    </>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/create" element={<PostFormPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit/:id" element={<PostFormPage />} />
            </Routes>
        </Router>
    );
}

export default App;