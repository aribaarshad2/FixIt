import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import API from '../config';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API}/bookings/${bookingId}`)
      .then(res => setBooking(res.data))
      .catch(() => {});
  }, [bookingId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await axios.post(`${API}/payments`, { bookingId, method });
      setMessage('Payment successful!');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setMessage('Payment failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  if (!booking) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;

  return (
    <div className="row justify-content-center mt-4 animate-fade-in-up">
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
              <i className="bi bi-credit-card text-white"></i>
            </div>
            <div>
              <h4 className="fw-bold mb-0">Complete Payment</h4>
              <small style={{ color: 'var(--text-secondary)' }}>Secure checkout</small>
            </div>
          </div>
          <div className="card-body p-4">
            {message && (
              <div className={`alert alert-modern d-flex align-items-center ${message.includes('successful') ? 'alert-modern-success' : 'alert-modern-danger'}`}>
                <i className={`bi ${message.includes('successful') ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>{message}
              </div>
            )}
            <div className="p-3 mb-4 rounded-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Service</span>
                <span className="fw-semibold">{booking.service?.name || 'Home Service'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Provider</span>
                <span className="fw-semibold">{booking.provider?.name}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Date</span>
                <span className="fw-semibold">{new Date(booking.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="price-tag">${booking.totalAmount?.toFixed(2)}</div>
              <p className="text-muted">Total Amount</p>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Payment Method</label>
              <select className="form-select form-modern" value={method} onChange={e => setMethod(e.target.value)}>
                <option value="card">Credit / Debit Card</option>
                <option value="online">Online Payment</option>
                <option value="cash">Cash on Service</option>
              </select>
            </div>
            {method === 'card' && (
              <div className="rounded-3 p-4 mb-4 text-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <i className="bi bi-credit-card-2-front fs-1" style={{ color: 'var(--primary)' }}></i>
                <p className="mt-2 text-muted small mb-0">Secure payment simulation</p>
                <div className="d-flex gap-2 justify-content-center mt-2">
                  <i className="bi bi- visa fs-2 text-muted"></i>
                  <i className="bi bi- mastercard fs-2 text-muted"></i>
                </div>
              </div>
            )}
            <button className="btn btn-modern btn-modern-primary w-100 py-2" onClick={handlePayment} disabled={processing}>
              {processing ? (
                <><span className="spinner-border spinner-border-sm me-1"></span>Processing...</>
              ) : (
                <><i className="bi bi-lock-fill me-1"></i>Pay ${booking.totalAmount?.toFixed(2)}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
