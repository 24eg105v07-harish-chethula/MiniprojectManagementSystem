import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, LogOut, Users, User, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onOpenUsersModal }) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '14px',
          paddingBottom: '14px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff, #cbd5e1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ProPulse
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Mini Project Management System
            </p>
          </div>
        </div>

        {/* User profile & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAdmin && (
            <button
              onClick={onOpenUsersModal}
              className="btn btn-secondary btn-sm"
              title="View all registered users"
            >
              <Users size={16} />
              <span>Users Directory</span>
            </button>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isAdmin ? 'rgba(168, 85, 247, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isAdmin ? '#c084fc' : '#818cf8',
              }}
            >
              {isAdmin ? <ShieldCheck size={18} /> : <User size={18} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.fullName || 'User'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </span>
            </div>
            <span className={`badge ${isAdmin ? 'badge-role-admin' : 'badge-role-user'}`} style={{ marginLeft: '4px' }}>
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
          </div>

          <button
            onClick={logout}
            className="btn btn-secondary btn-icon"
            title="Log Out"
          >
            <LogOut size={18} color="#94a3b8" />
          </button>
        </div>
      </div>
    </header>
  );
};
