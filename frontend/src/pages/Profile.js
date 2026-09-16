import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function Profile() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [stats, setStats] = useState({ totalBookings: 0, completed: 0, totalSpent: 0 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
      axios.get(`${API}/bookings/my`).then(res => {
        const b = res.data;
        setStats({
          totalBookings: b.length,
          completed: b.filter(x => x.status === 'completed').length,
          totalSpent: b.filter(x => x.paymentStatus === 'paid').reduce((s, x) => s + (x.totalAmount || 0), 0),
        });
      }).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/auth/profile`, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 950, margin: '0 auto', width: '100%' }}>
      <div className="row g-4 align-items-stretch">
        {/* Left Card - Profile Info */}
        <div className="col-md-4">
          <div className="card-modern h-100" style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(160deg, #0d2a3a 0%, rgba(38,198,201,0.3) 60%, #0f3545 100%)',
              padding: '2rem 1.5rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <svg style={{ position: 'absolute', top: -15, right: -15, width: 110, height: 110, opacity: 0.12 }} viewBox="0 0 200 200">
                <path d="M20,180 Q80,40 180,20 Q120,100 180,180 Z" fill="white"/>
              </svg>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '3px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 700, color: 'white',
                margin: '0 auto 0.8rem', position: 'relative', zIndex: 1,
              }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h4 className="fw-bold text-white mb-1" style={{ fontSize: '1.15rem', position: 'relative', zIndex: 1 }}>{user.name}</h4>
              <p className="mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', position: 'relative', zIndex: 1 }}>{user.email}</p>
              <span style={{
                display: 'inline-block', background: 'white', color: '#008080',
                padding: '3px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                position: 'relative', zIndex: 1,
              }}>
                {user.role}
              </span>
            </div>

            {/* Stats */}
            <div className="card-body p-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <i className="bi bi-calendar3"></i> Total Bookings
                  </span>
                  <span className="fw-bold" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{stats.totalBookings}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <i className="bi bi-check2-circle"></i> Completed
                  </span>
                  <span className="fw-bold" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{stats.completed}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center" style={{ padding: '10px 0' }}>
                  <span className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <i className="bi bi-wallet2"></i> Total Spent
                  </span>
                  <span className="fw-bold" style={{ color: 'var(--text)', fontSize: '0.9rem' }}>${stats.totalSpent.toFixed(2)}</span>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center gap-2 mt-3" style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.78rem' }}>
                <i className="bi bi-shield-check"></i>
                <span>Your trust<br/>is our priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Edit Profile */}
        <div className="col-md-8">
          <div className="card-modern h-100" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {/* Header */}
            <div className="page-header">
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: 'linear-gradient(135deg, #26c6c9, #1a9fa2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, position: 'relative', zIndex: 1,
              }}>
                <i className="bi bi-pencil-square text-white" style={{ fontSize: '1.1rem' }}></i>
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h4 className="fw-bold mb-0">Edit Profile</h4>
                <small style={{ color: 'var(--text-secondary)' }}>Keep your information up to date</small>
              </div>
            </div>

            {/* Form */}
            <div className="card-body p-4">
              {saved && (
                <div className="alert alert-modern alert-modern-success">
                  <i className="bi bi-check-circle me-2"></i>Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person me-1" style={{ color: 'var(--primary)' }}></i> Full Name
                  </label>
                  <input
                    className="form-control form-modern"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-telephone me-1" style={{ color: 'var(--primary)' }}></i> Phone
                  </label>
                  <input
                    className="form-control form-modern"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-geo-alt me-1" style={{ color: 'var(--primary)' }}></i> Address
                  </label>
                  <input
                    className="form-control form-modern"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2">
                  <i className="bi bi-check-lg me-1"></i> Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
