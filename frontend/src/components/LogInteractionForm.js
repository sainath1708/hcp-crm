import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logInteraction } from '../store/interactionSlice';

function LogInteractionForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.interactions);
  const [form, setForm] = useState({
    hcp_name: '', interaction_type: 'Meeting', date: '', time: '',
    attendees: '', topics_discussed: '', outcomes: '', follow_up_actions: '', sentiment: 'Neutral'
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(logInteraction(form));
    setSuccess(true);
    setForm({ hcp_name: '', interaction_type: 'Meeting', date: '', time: '',
      attendees: '', topics_discussed: '', outcomes: '', follow_up_actions: '', sentiment: 'Neutral' });
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 600 }}>📋 Log HCP Interaction</h2>
        {success && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#2e7d32', fontSize: '14px' }}>✅ Interaction logged successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div><label style={labelStyle}>HCP Name *</label><input style={inputStyle} name="hcp_name" value={form.hcp_name} onChange={handleChange} placeholder="Dr. Smith" required /></div>
            <div><label style={labelStyle}>Interaction Type</label><select style={inputStyle} name="interaction_type" value={form.interaction_type} onChange={handleChange}>{['Meeting', 'Call', 'Email', 'Conference', 'Visit'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label style={labelStyle}>Date *</label><input style={inputStyle} type="date" name="date" value={form.date} onChange={handleChange} required /></div>
            <div><label style={labelStyle}>Time</label><input style={inputStyle} type="time" name="time" value={form.time} onChange={handleChange} /></div>
          </div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Attendees</label><input style={inputStyle} name="attendees" value={form.attendees} onChange={handleChange} placeholder="Dr. Smith, Nurse Johnson..." /></div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Topics Discussed</label><textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} name="topics_discussed" value={form.topics_discussed} onChange={handleChange} placeholder="Key discussion points..." /></div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Outcomes</label><textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} name="outcomes" value={form.outcomes} onChange={handleChange} placeholder="Key outcomes..." /></div>
          <div style={{ marginBottom: '20px' }}><label style={labelStyle}>Follow-up Actions</label><textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} name="follow_up_actions" value={form.follow_up_actions} onChange={handleChange} placeholder="Next steps..." /></div>
          <div style={{ marginBottom: '24px' }}><label style={labelStyle}>HCP Sentiment</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Positive', 'Neutral', 'Negative'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="radio" name="sentiment" value={s} checked={form.sentiment === s} onChange={handleChange} />
                  {s === 'Positive' ? '😊' : s === 'Neutral' ? '😐' : '😞'} {s}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ background: loading ? '#ccc' : '#1a73e8', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {loading ? 'Logging...' : '💾 Log Interaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LogInteractionForm;