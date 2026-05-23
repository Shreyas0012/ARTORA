import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, User, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left flex items-center gap-4">
          {!isHome && (
            <button className="menu-btn opacity-60 hover:opacity-100 transition-opacity" aria-label="Go Back" onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>
          )}
          <button className="menu-btn" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>

        <nav className="navbar-links">
          <Link to="/explore">Explore</Link>
          <Link to="/collections">Collections</Link>
          {user?.role === 'ARTIST' && <Link to="/dashboard/artist">Artist Dashboard</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" className="text-accent">Admin Panel</Link>}
        </nav>

        <div className="navbar-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-80" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                {user.name} ({user.role})
              </span>
              <button onClick={logout} className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-700" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={14} /> [ Logout ]
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-700">
              [ Login ]
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
