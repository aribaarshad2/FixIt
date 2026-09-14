import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import API from '../config';

export default function ProviderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/providers/${id}`),
      axios.get(`${API}/reviews/provider/${id}`),
      user ? axios.get(`${API}/favorites/check/${id}`) : Promise.resolve({ data: { favorited: false } }),
    ]).then(([p, r, f]) => {
      setProvider(p.data);
      setReviews(r.data);
      if (f) setFavorited(f.data.favorited);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id, user]);

  useEffect(() => {
    axios.get(`${API}/ai/summary/${id}`).then(res => setSummary(res.data.summary)).catch(() => {}).finally(() => setSummaryLoading(false));
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      axios.get(`${API}/ai/sentiment/${id}`).then(res => {
        setSentiment(res.data);
        const sentMap = {};
        (res.data.reviews || []).forEach(r => { sentMap[r._id] = r.sentiment; });
        setReviews(prev => prev.map(r => ({ ...r, sentiment: sentMap[r._id] })));
      }).catch(() => {});
    } else {
      setSentiment(null);
    }
  }, [id, reviews.length]);

  const toggleFav = async () => {
    if (!user) return;
    const res = await axios.post(`${API}/favorites/toggle`, { providerId: id });
    setFavorited(res.data.favorited);
  };

  if (loading) return <div className="text-center mt-5"><div className="loading-spinner mx-auto"></div></div>;
  if (!provider) return <div className="empty-state"><h5>Provider not found</h5></div>;

  return (
    <div className="row g-4 animate-fade-in align-items-stretch">
      <div className="col-md-4">
        <div className="card-modern h-100" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {/* Profile Header */}
          <div style={{
            background: 'linear-gradient(160deg, #0d2a3a 0%, rgba(38,198,201,0.3) 60%, #0f3545 100%)',
            padding: '2rem 1.5rem 1.5rem', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <svg style={{ position: 'absolute', top: -15, right: -15, width: 110, height: 110, opacity: 0.12 }} viewBox="0 0 200 200">
              <path d="M20,180 Q80,40 180,20 Q120,100 180,180 Z" fill="white"/>
            </svg>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: 'white',
              margin: '0 auto 12px', position: 'relative', zIndex: 1,
            }}>
              {provider.name?.charAt(0)}
            </div>
            <h4 className="fw-bold mb-1 text-white" style={{ position: 'relative', zIndex: 1 }}>{provider.name}</h4>
            <span style={{
              display: 'inline-block', background: 'white', color: '#008080',
              padding: '3px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
              position: 'relative', zIndex: 1,
            }}>{provider.profession}</span>
          </div>

          {/* Stats */}
          <div className="card-body p-4" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <div className="d-flex justify-content-between p-2 rounded-3 mb-2" style={{ background: 'var(--surface-2)' }}>
                <span>Rating</span>
                <span className="fw-bold"><i className="bi bi-star-fill text-warning me-1"></i>{provider.rating || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded-3 mb-2" style={{ background: 'var(--surface-2)' }}>
                <span>Experience</span>
                <span className="fw-bold">{provider.experience} years</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded-3 mb-2" style={{ background: 'var(--surface-2)' }}>
                <span>Rate</span>
                <span className="fw-bold" style={{ color: 'var(--primary)' }}>${provider.pricePerHour}/hr</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded-3 mb-2" style={{ background: 'var(--surface-2)' }}>
                <span>Reviews</span>
                <span className="fw-bold">{provider.totalReviews || 0}</span>
              </div>
              <div className="d-flex justify-content-between p-2 rounded-3 mb-3" style={{ background: 'var(--surface-2)' }}>
                <span>Status</span>
                {provider.isAvailable ? (
                  <span className="badge badge-modern-success">Available</span>
                ) : (
                  <span className="badge badge-modern-warning">Busy</span>
                )}
              </div>
              {provider.description && (
                <p className="text-muted small mb-3">{provider.description}</p>
              )}
            </div>
            {user && user.role === 'user' && (
              <div className="d-flex gap-2 mt-auto">
                <Link to={`/book/${provider._id}`} className="btn btn-modern btn-modern-primary flex-grow-1">
                  <i className="bi bi-calendar-plus me-1"></i>Book Now
                </Link>
                <button className="btn btn-modern btn-modern-outline" onClick={toggleFav}
                  style={{ color: favorited ? '#ef4444' : undefined, borderColor: favorited ? '#ef4444' : undefined }}>
                  <i className={`bi ${favorited ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card-modern mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {/* AI Summary Header */}
          <div style={{
            background: 'linear-gradient(135deg, #132234 0%, rgba(38,198,201,0.15) 50%, #0d2a3a 100%)',
            padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <i className="bi bi-stars" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
            <h6 className="fw-bold mb-0">AI Summary</h6>
          </div>
          <div className="card-body p-4">
            {summaryLoading ? (
              <div className="d-flex align-items-center gap-2 text-muted small">
                <div className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></div>
                Analyzing reviews...
              </div>
            ) : summary ? (
              <p className="mb-0" style={{ background: 'var(--surface-2)', padding: '14px 16px', borderRadius: 12 }}>{summary}</p>
            ) : null}
          </div>
        </div>
        <div className="card-modern mb-4" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {/* Reviews Header */}
          <div style={{
            background: 'linear-gradient(135deg, #132234 0%, rgba(38,198,201,0.15) 50%, #0d2a3a 100%)',
            padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
          }}>
            <i className="bi bi-star" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
            <h6 className="fw-bold mb-0">Reviews ({reviews.length})</h6>
          </div>
          <div className="card-body p-4">
            {sentiment && (
              <div className="d-flex align-items-center gap-3 flex-wrap mb-4 p-3 rounded-3" style={{ background: 'var(--surface-2)' }}>
                <div className="text-center">
                  <div className={`sentiment-dot ${sentiment.overall}`}></div>
                  <small className="text-muted d-block mt-1">AI Sentiment</small>
                </div>
                <div>
                  <span className={`badge ${sentiment.overall === 'positive' ? 'badge-modern-success' : sentiment.overall === 'negative' ? 'badge-modern-danger' : 'badge-modern-warning'} fs-6`}>
                    {sentiment.overall === 'positive' ? '😊' : sentiment.overall === 'negative' ? '😞' : '😐'} {sentiment.overall}
                  </span>
                  <div className="mt-2 d-flex gap-3 small">
                    <span className="text-success"><i className="bi bi-hand-thumbs-up me-1"></i>{sentiment.breakdown.positive} positive</span>
                    <span className="text-muted"><i className="bi bi-dash-circle me-1"></i>{sentiment.breakdown.neutral} neutral</span>
                    <span className="text-danger"><i className="bi bi-hand-thumbs-down me-1"></i>{sentiment.breakdown.negative} negative</span>
                  </div>
                </div>
              </div>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                No reviews yet. Be the first to review!
              </div>
            ) : (
              reviews.map(r => (
                <div key={r._id} className="border-bottom pb-3 mb-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="d-flex justify-content-between">
                    <div className="fw-semibold">{r.user?.name || 'Anonymous'}</div>
                    <div>{[1,2,3,4,5].map(s => <i key={s} className={`bi ${s <= r.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'} me-1`}></i>)}</div>
                  </div>
                  {r.comment && <p className="text-muted small mt-1 mb-0">{r.comment}</p>}
                  <div className="d-flex align-items-center gap-2 mt-1">
                    {r.sentiment && (
                      <span className={`badge ${r.sentiment === 'positive' ? 'badge-modern-success' : r.sentiment === 'negative' ? 'badge-modern-danger' : 'badge-modern-warning'}`}>
                        <i className={`bi ${r.sentiment === 'positive' ? 'bi-emoji-smile' : r.sentiment === 'negative' ? 'bi-emoji-frown' : 'bi-emoji-neutral'} me-1`}></i>
                        {r.sentiment}
                      </span>
                    )}
                    <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
