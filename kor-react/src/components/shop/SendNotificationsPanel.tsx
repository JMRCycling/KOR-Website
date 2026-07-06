import React, { useState } from 'react';
import posthog from '../../lib/posthog';

interface SendState {
  sending: boolean;
  error: string | null;
  success: string | null;
}

const SendNotificationsPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [state, setState] = useState<SendState>({ sending: false, error: null, success: null });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ sending: true, error: null, success: null });

    try {
      const shop_name = sessionStorage.getItem('shop_name') || '';
      const shop_token = sessionStorage.getItem('shop_token') || '';

      if (!shop_name || !shop_token) {
        throw new Error('Missing shop credentials in session. Please log in again.');
      }
      if (!message.trim()) {
        throw new Error('Please enter a message to send.');
      }

      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
      const bearer = process.env.REACT_APP_API_BEARER_TOKEN; // Do NOT hardcode; set in .env

      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      if (bearer) {
        headers['Authorization'] = `Bearer ${bearer}`;
      }

      const bodyParams = new URLSearchParams();
      bodyParams.set('shop_name', shop_name);
      bodyParams.set('shop_token', shop_token);
      bodyParams.set('message', message.trim());

      const response = await fetch(`${baseUrl}/sendPushNotifications`, {
        method: 'POST',
        headers,
        body: bodyParams as unknown as BodyInit,
        redirect: 'follow' as RequestRedirect
      });

      const text = await response.text().catch(() => '');
      if (!response.ok) {
        throw new Error(text || `HTTP ${response.status}`);
      }

      posthog.capture('notification_sent', {
        shop_name,
        message_length: message.trim().length
      });
      setState({ sending: false, error: null, success: 'Your message has been sent to your customers.' });
      setMessage('');
    } catch (err) {
      posthog.captureException(err as Error);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setState({ sending: false, error: msg, success: null });
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center' }}>
        ✉️ Send Notifications
      </h3>
      <p style={{ color: '#666', marginTop: '0.25rem' }}>
        Send a push notification to all customers who are linked to your shop.
      </p>

      <form onSubmit={handleSend}>
        <div style={{ margin: '1rem 0' }}>
          <label htmlFor="kor-send-message" style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: '#333' }}>
            Message
          </label>
          <textarea
            id="kor-send-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message (e.g., Service special this week! or Your bike service is due)"
            rows={3}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical' }}
          />
        </div>

        {state.error && (
          <div style={{ backgroundColor: '#ffe6e6', color: '#d63031', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d63031', marginBottom: '0.75rem' }}>
            {state.error}
          </div>
        )}
        {state.success && (
          <div style={{ backgroundColor: '#e6f7e6', color: '#00b894', padding: '0.75rem', borderRadius: '6px', border: '1px solid #00b894', marginBottom: '0.75rem' }}>
            {state.success}
          </div>
        )}

        <button
          type="submit"
          disabled={state.sending || !message.trim()}
          style={{
            backgroundColor: state.sending ? '#95a5a6' : '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: '6px',
            cursor: state.sending ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => {
            if (!state.sending) e.currentTarget.style.backgroundColor = '#218838';
          }}
          onMouseOut={(e) => {
            if (!state.sending) e.currentTarget.style.backgroundColor = '#28a745';
          }}
        >
          {state.sending ? 'Sending…' : 'Send to all shop customers'}
        </button>
      </form>

      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#888' }}>
        Note: Available for Premium and Pro plans. Requires shop session from login.
      </div>
    </div>
  );
};

export default SendNotificationsPanel;