import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API from '../config';

const menus = {
  user: [
    { label: 'Home', icon: 'bi-house', path: '/' },
    { label: 'Services', icon: 'bi-grid', path: '/services' },
    { label: 'AI Assistant', icon: 'bi-stars', path: '/ai-tools' },
    { label: 'My Bookings', icon: 'bi-calendar-check', path: '/my-bookings', badgeKey: 'bookings' },
    { label: 'Favorites', icon: 'bi-heart', path: '/favorites' },
    { label: 'Profile', icon: 'bi-person', path: '/profile' },
  ],
  provider: [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/provider-dashboard' },
    { label: 'Edit Profile', icon: 'bi-pencil', path: '/provider-edit-profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/admin' },
    { label: 'Users', icon: 'bi-people', path: '/admin?tab=users' },
    { label: 'Providers', icon: 'bi-person-badge', path: '/admin?tab=providers' },
    { label: 'Bookings', icon: 'bi-calendar-check', path: '/admin?tab=bookings' },
    { label: 'Reports', icon: 'bi-exclamation-triangle', path: '/admin?tab=reports' },
    { label: 'Sub Admins', icon: 'bi-person-gear', path: '/admin?tab=subadmins' },
  ],
  subadmin: [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/admin' },
    { label: 'Bookings', icon: 'bi-calendar-check', path: '/admin?tab=bookings' },
    { label: 'Reports', icon: 'bi-exclamation-triangle', path: '/admin?tab=reports' },
  ],
};

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'user') {
      axios.get(`${API}/bookings/my`).then(res => {
        const pending = res.data.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
        setBookingCount(pending);
      }).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const items = menus[user.role] || [];
  const badges = { bookings: bookingCount };

  return (
    <div className={`app-sidebar ${collapsed ? 'sidebar-collapsed' : ''}`} style={{
      background: 'linear-gradient(180deg, #0d2a3a 0%, #0b1e2e 40%, #0f3545 80%, #0b2233 100%)',
      display: 'flex',
      flexDirection: 'column',
      border: 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Wave decoration at bottom */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '45%', opacity: 0.15, pointerEvents: 'none' }} viewBox="0 0 200 200" preserveAspectRatio="none">
        <path d="M0,120 Q40,80 80,100 Q120,120 160,90 Q180,75 200,85 L200,200 L0,200 Z" fill="rgba(38,198,201,0.4)"/>
        <path d="M0,150 Q50,110 100,130 Q150,150 200,120 L200,200 L0,200 Z" fill="rgba(38,198,201,0.25)"/>
      </svg>

      {/* Header: Logo + Collapse */}
      <div style={{ padding: '1.25rem 1.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #26c6c9, #1a9fa2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(38,198,201,0.3)',
          }}>
            <img src="/logo.png" alt="FixIt" style={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          {!collapsed && <span className="fw-bold text-white" style={{ fontSize: '1.2rem', letterSpacing: '-0.5px' }}>FixIt</span>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} style={{ fontSize: '0.85rem' }}></i>
        </button>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 0.5rem', position: 'relative', zIndex: 1 }}>
        {items.map(item => {
          const isActive = location.pathname + location.search === item.path || (item.path !== '/' && location.pathname.startsWith(item.path.split('?')[0]));
          return (
            <button
              key={item.path}
              className="sidebar-link"
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                padding: collapsed ? '0.7rem 0' : '0.72rem 1rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                width: '100%', border: 'none', background: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: '0.88rem', fontWeight: isActive ? 600 : 500,
                borderRadius: 10, cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? 'rgba(38,198,201,0.2)' : 'transparent',
                position: 'relative',
              }}
            >
              {isActive && <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: '60%', borderRadius: '0 4px 4px 0',
                background: '#26c6c9',
              }}></div>}
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.05rem', width: 20, textAlign: 'center', flexShrink: 0, color: isActive ? '#26c6c9' : 'inherit' }}></i>
              {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>}
              {!collapsed && item.badgeKey && badges[item.badgeKey] > 0 && (
                <span style={{
                  background: '#26c6c9', color: 'white', fontSize: '0.7rem', fontWeight: 700,
                  padding: '2px 8px', borderRadius: 10, minWidth: 22, textAlign: 'center',
                }}>{badges[item.badgeKey]}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Promo Card */}
      {!collapsed && (
        <div style={{
          margin: '0 0.75rem 0.75rem', padding: '1rem',
          background: 'linear-gradient(135deg, rgba(38,198,201,0.15) 0%, rgba(38,198,201,0.05) 100%)',
          borderRadius: 14, border: '1px solid rgba(38,198,201,0.15)',
          position: 'relative', zIndex: 1, overflow: 'hidden',
        }}>
          <i className="bi bi-stars" style={{ color: '#26c6c9', fontSize: '1.1rem', marginBottom: 6, display: 'block' }}></i>
          <div className="fw-bold text-white" style={{ fontSize: '0.95rem', lineHeight: 1.3, marginBottom: 4 }}>
            Better<br/>Services<br/>For a Smarter<br/>Tomorrow
          </div>
        </div>
      )}

      {/* User + Logout */}
      <div style={{ padding: '0.75rem 1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }}>
        <div
          onClick={() => setUserExpanded(!userExpanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            cursor: 'pointer', padding: '0.5rem 0',
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #26c6c9, #1a9fa2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.95rem', color: 'white', flexShrink: 0,
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fw-semibold text-white" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user.role}</div>
            </div>
          )}
          {!collapsed && (
            <i className={`bi bi-chevron-${userExpanded ? 'up' : 'down'}`} style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}></i>
          )}
        </div>

        {userExpanded && !collapsed && (
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            width: '100%', padding: '0.6rem 0.75rem', marginTop: '0.35rem',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <i className="bi bi-box-arrow-left" style={{ fontSize: '0.9rem' }}></i>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
