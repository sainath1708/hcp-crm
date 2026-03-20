import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chatWithAgent, logFromChat } from '../store/interactionSlice';

function ChatInterface() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.interactions);
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Hi! I am your HCP CRM Assistant. Describe your interaction with a doctor and I will log it for you!' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    const result = await dispatch(chatWithAgent(userMsg));
    if (result.payload?.response) {
      setMessages(prev => [...prev, { role: 'ai', text: result.payload.response }]);
    }
  };

  const logFromChatHandler = async () => {
    const userMessages = messages.filter(m => m.role === 'user').map(m => m.text).join(' ');
    if (!userMessages) return;
    const result = await dispatch(logFromChat(userMessages));
    if (result.payload?.success) {
      setMessages(prev => [...prev, { role: 'ai', text: '✅ Interaction logged successfully!' }]);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ background: '#1a73e8', padding: '16px 24px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontWeight: 600, fontSize: '16px' }}>🤖 AI Assistant</div><div style={{ fontSize: '12px', opacity: 0.8 }}>Log interactions via chat</div></div>
          <button onClick={logFromChatHandler} disabled={loading} style={{ background: 'white', color: '#1a73e8', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
            {loading ? 'Logging...' : '💾 Log This Interaction'}
          </button>
        </div>
        <div style={{ height: '450px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? '#1a73e8' : '#f1f3f4', color: msg.role === 'user' ? 'white' : '#1a1a1a', fontSize: '14px', lineHeight: '1.5' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', justifyContent: 'flex-start' }}><div style={{ background: '#f1f3f4', padding: '12px 16px', borderRadius: '18px', fontSize: '14px', color: '#666' }}>⏳ Thinking...</div></div>}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '12px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Describe your interaction..." style={{ flex: 1, padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '24px', fontSize: '14px', outline: 'none' }} />
          <button onClick={sendMessage} disabled={loading} style={{ background: '#1a73e8', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '24px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;