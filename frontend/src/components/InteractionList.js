import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions, suggestFollowups, analyzeSentiment } from '../store/interactionSlice';

function InteractionList() {
  const dispatch = useDispatch();
  const { interactions, loading } = useSelector(state => state.interactions);
  const [message, setMessage] = useState('');

  useEffect(() => { dispatch(fetchInteractions()); }, [dispatch]);

  const handleSuggest = async (id) => {
    setMessage('⏳ Generating follow-up suggestions...');
    const result = await dispatch(suggestFollowups(id));
    if (result.payload?.success) {
      setMessage('✅ Follow-up suggestions generated!');
      dispatch(fetchInteractions());
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleSentiment = async (id) => {
    setMessage('⏳ Analyzing sentiment...');
    const result = await dispatch(analyzeSentiment(id));
    if (result.payload?.success) {
      setMessage(`✅ Sentiment analyzed: ${result.payload.sentiment}`);
      dispatch(fetchInteractions());
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>📊 Interaction History</h2>
        <button onClick={() => dispatch(fetchInteractions())} style={{ background: '#1a73e8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>🔄 Refresh</button>
      </div>
      {message && <div style={{ background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#2e7d32', fontSize: '14px' }}>{message}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>⏳ Loading interactions...</div>}
      {!loading && interactions.length === 0 && <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#666' }}>No interactions yet!</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {interactions.map(interaction => (
          <div key={interaction.id} style={{ background: 'white', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${interaction.sentiment === 'Positive' ? '#4caf50' : interaction.sentiment === 'Negative' ? '#f44336' : '#ff9800'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>👨‍⚕️ {interaction.hcp_name}</h3>
                <span style={{ fontSize: '13px', color: '#666' }}>{interaction.interaction_type} • {interaction.date}</span>
              </div>
              <span style={{ background: interaction.sentiment === 'Positive' ? '#e8f5e9' : interaction.sentiment === 'Negative' ? '#ffebee' : '#fff8e1', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, height: 'fit-content' }}>
                {interaction.sentiment === 'Positive' ? '😊' : interaction.sentiment === 'Negative' ? '😞' : '😐'} {interaction.sentiment || 'Unknown'}
              </span>
            </div>
            {interaction.topics_discussed && <div style={{ marginBottom: '8px', fontSize: '14px' }}><strong>Topics: </strong>{interaction.topics_discussed}</div>}
            {interaction.outcomes && <div style={{ marginBottom: '8px', fontSize: '14px' }}><strong>Outcomes: </strong>{interaction.outcomes}</div>}
            {interaction.follow_up_actions && <div style={{ marginBottom: '12px', fontSize: '14px' }}><strong>Follow-ups: </strong>{interaction.follow_up_actions}</div>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => handleSuggest(interaction.id)} disabled={loading} style={{ background: '#e3f2fd', color: '#1a73e8', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>💡 Suggest Follow-ups</button>
              <button onClick={() => handleSentiment(interaction.id)} disabled={loading} style={{ background: '#f3e5f5', color: '#7b1fa2', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>🧠 Analyze Sentiment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InteractionList;