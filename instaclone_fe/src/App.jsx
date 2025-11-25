
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostLists.jsx';
import PostFormPage from './components/PostFormPage.jsx';
import Profile from "./Pages/Profile.jsx";
import AuthCallback from "./Pages/AuthCallback.jsx";
import Home from "./Pages/Home.jsx"

function App() {

    return (
        <Router>
            <nav>
                <Link to="/">Posts</Link> | <Link to="/create">Create Post</Link> |{' '}
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/create" element={<PostFormPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit/:id" element={<PostFormPage />} />
            </Routes>
        </Router>
    );
}

export default App;
