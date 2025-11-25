// Layout.jsx
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      
      <main>
        <Outlet />  {/* Page content renders here */}
      </main>
      
      <footer>© 2025 Instaclone</footer>
    </div>
  );
}