import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import LogInteractionForm from './components/LogInteractionForm';
import ChatInterface from './components/ChatInterface';
import InteractionList from './components/InteractionList';

function AppContent() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ background: '#1a73e8', padding: '16px 32px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>🏥 HCP CRM</h1>
        <span style={{ opacity: 0.8, fontSize: '14px' }}>AI-First Healthcare CRM</span>
      </div>
      <div style={{ background: 'white', borderBottom: '1px solid #e0e0e0', padding: '0 32px', display: 'flex', gap: '8px' }}>
        {['form', 'chat', 'history'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '14px 20px', border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: activeTab === tab ? '2px solid #1a73e8' : '2px solid transparent',
            color: activeTab === tab ? '#1a73e8' : '#666',
            fontWeight: activeTab === tab ? 600 : 400,
            fontSize: '14px', fontFamily: 'Inter, sans-serif',
            textTransform: 'capitalize'
          }}>
            {tab === 'form' ? '📋 Log Interaction' : tab === 'chat' ? '🤖 AI Chat' : '📊 History'}
          </button>
        ))}
      </div>
      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'form' && <LogInteractionForm />}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'history' && <InteractionList />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;