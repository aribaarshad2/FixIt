import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import API from '../config';

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API}/bookings/${id}`)
      .then(res => setBooking(res.data))
      .catch(() => setError('Booking not found'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/reviews`, { booking: id, rating, comment });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking && !error) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;

  return (
    <div className="row justify-content-center animate-fade-in">
      <div className="col-md-5">
        <div className="card-modern" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(135deg, #132234 0%, rgba(38,198,201,0.2) 50%, #0d2a3a 100%)',
            padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'linear-gradient(135deg, #26c6c9, #1a9fa2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <i className="bi bi-star text-white"></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0">{done ? 'Thank You!' : 'Write a Review'}</h4>
              <small style={{ color: 'var(--text-secondary)' }}>{done ? 'Your feedback helps others' : 'Share your experience'}</small>
            </div>
          </div>
          <div className="card-body p-4">
            {error && <div className="alert alert-modern alert-modern-danger"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
            {done ? (
              <div className="text-center py-3">
                <div style={{ fontSize: 48 }} className="mb-2">⭐</div>
                <p className="text-muted mb-3">Your review has been submitted.</p>
                <button className="btn btn-modern btn-modern-primary" onClick={() => navigate('/my-bookings')}>Back to Bookings</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {booking && (
                  <div className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="provider-avatar">{booking.provider?.name?.charAt(0)}</div>
                    <div>
                      <div className="fw-semibold">{booking.provider?.name}</div>
                      <small className="text-muted">{new Date(booking.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                )}
                <div className="mb-4 text-center">
                  <label className="form-label fw-semibold d-block">Rating</label>
                  <div className="d-flex justify-content-center gap-1" style={{ fontSize: 32 }}>
                    {[1,2,3,4,5].map(s => (
                      <i key={s} className={`bi ${s <= rating ? 'bi-star-fill' : 'bi-star'}`}
                        style={{ color: s <= rating ? '#fbbf24' : 'var(--border)', cursor: 'pointer', transition: 'transform 0.2s' }}
                        onClick={() => setRating(s)}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}></i>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Comment (optional)</label>
                  <textarea className="form-control form-modern" rows="3" placeholder="Describe your experience..." value={comment} onChange={e => setComment(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-modern btn-modern-primary w-100 py-2" disabled={submitting}>
                  {submitting ? (<><span className="spinner-border spinner-border-sm me-1"></span>Submitting...</>) : (<><i className="bi bi-send me-1"></i>Submit Review</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
