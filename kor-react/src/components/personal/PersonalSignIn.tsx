import React, { useEffect, useState } from 'react';
import { } from '@auth0/auth0-react';
import LegacyAuthGuard from '../auth/LegacyAuthGuard';
import { useLegacyParams, logLegacyParams } from '../../hooks/useLegacyParams';
import posthog from '../../lib/posthog';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const PersonalSignIn: React.FC = () => {
  const params = useLegacyParams();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    logLegacyParams(params, 'PersonalSignIn');
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[+]?[1-9]?[0-9]{7,15}$/;
    return re.test(phone.replace(/[\s\-()]/g, ''));
  };

  // Helpers reused from shop flow, adapted for personal endpoints
  const getAuth0ManagementToken = async (): Promise<string> => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
    console.log('🪪 [PersonalSignIn][Token] Requesting management token', { endpoint: `${baseUrl}/getauth0Token` });
    const resp = await fetch(`${baseUrl}/getauth0Token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ access_token: 'auth0_token' }) as unknown as BodyInit,
      redirect: 'follow' as RequestRedirect
    });
    console.log('🪪 [PersonalSignIn][Token] Response received', { status: resp.status });

    if (!resp.ok) {
      let errTxt = '';
      try { errTxt = await resp.text(); } catch {}
      console.warn('🪪 [PersonalSignIn][Token] Non-OK response body', errTxt?.slice(0, 200));
      throw new Error(`Failed to get Auth0 token (${resp.status})`);
    }

    let data: any;
    try {
      data = await resp.json();
    } catch {
      const text = await resp.text();
      data = JSON.parse(text);
    }

    const token = data?.token?.[0]?.auth0_token;
    console.log('🪪 [PersonalSignIn][Token] Token parsed', { length: token ? String(token).length : 0 });
    if (!token) throw new Error('Auth0 token missing in response');
    return token;
  };

  const createAuth0User = async (
    email: string,
    password: string,
    name: string,
    mgmtToken: string
  ): Promise<string> => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN || 'dev-oseu3r74.us.auth0.com';
    const url = `https://${domain}/api/v2/users`;
    console.log('👤 [PersonalSignIn][Auth0User] Creating Auth0 user', { domain, url });

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mgmtToken}`
      },
      body: JSON.stringify({
        email,
        password,
        connection: 'Username-Password-Authentication',
        name
      }),
      redirect: 'follow' as RequestRedirect
    });

    const payloadText = await resp.text();
    let payload: any = {};
    try { payload = JSON.parse(payloadText); } catch {}
    console.log('👤 [PersonalSignIn][Auth0User] Response', { status: resp.status, hasUserId: !!payload?.user_id, hasError: !!payload?.error });

    if (!resp.ok || payload?.error || !payload?.user_id) {
      const message =
        payload?.message ||
        payload?.error_description ||
        payload?.error ||
        `Failed to create Auth0 user (${resp.status})`;
      console.error('👤 [PersonalSignIn][Auth0User] Error creating user', { status: resp.status, message, payloadSnippet: typeof payloadText === 'string' ? payloadText.slice(0, 200) : undefined });
      throw new Error(message);
    }

    return payload.user_id as string;
  };

  const createPersonalAccount = async (
    userId: string
  ): Promise<void> => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';

    const paramsBody = new URLSearchParams();
    paramsBody.append('name', formData.name);
    paramsBody.append('email', formData.email);
    paramsBody.append('password', formData.password);
    if (params.sub_id) paramsBody.append('sub_Id', params.sub_id);
    if (params.invoice_id) paramsBody.append('invoice_Id', params.invoice_id);
    if (params.plan_type) paramsBody.append('plan_type', params.plan_type);
    paramsBody.append('phone', formData.phone);
    paramsBody.append('auth0_sub_id', userId);

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    console.log('👤 [PersonalSignIn][Backend] Creating personal account', {
      endpoint: `${baseUrl}/signinPersonal`,
      bodyKeys: Array.from(paramsBody.keys())
    });

    const resp = await fetch(`${baseUrl}/signinPersonal`, {
      method: 'POST',
      headers,
      body: paramsBody as unknown as BodyInit,
      redirect: 'follow' as RequestRedirect
    });

    const respText = await resp.text();
    console.log('👤 [PersonalSignIn][Backend] Response', { status: resp.status, bodySnippet: respText.slice(0, 200) });

    if (!resp.ok) {
      throw new Error(`Failed to create personal account (${resp.status}) ${respText || ''}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    posthog.capture('personal_signup_submitted', {
      has_plan_type: !!params.plan_type,
      plan_type: params.plan_type || null
    });
    setIsLoading(true);

    try {
      const traceId = Math.random().toString(36).slice(2, 8);
      console.log(`🚀 [PersonalSignIn][Trace ${traceId}] Starting signup flow`, {
        formData: { ...formData, password: '********' },
        params,
        timestamp: new Date().toISOString()
      });

      // 1) Get Auth0 management token
      const mgmtToken = await getAuth0ManagementToken();
      console.log('🪪 [PersonalSignIn] Management token acquired');

      // 2) Create Auth0 user with provided password
      const auth0UserId = await createAuth0User(
        formData.email,
        formData.password,
        formData.name,
        mgmtToken
      );
      console.log('👤 [PersonalSignIn] Auth0 user created', { userId: auth0UserId });

      // 3) Create personal account on backend
      await createPersonalAccount(auth0UserId);
      console.log('👤 [PersonalSignIn] Personal account created on server');

      // 4) Legacy flow: login via backend to hydrate session data
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'https://jmrcycling.com:3001';
      const loginHeaders: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const loginBody = new URLSearchParams();
      loginBody.append('email', formData.email);
      loginBody.append('auth0_sub_id', auth0UserId);

      console.log('👤 [PersonalSignIn][Backend] Logging in to hydrate session', { endpoint: `${baseUrl}/loginShop` });
      const loginResp = await fetch(`${baseUrl}/loginShop`, {
        method: 'POST',
        headers: loginHeaders,
        body: loginBody as unknown as BodyInit,
        redirect: 'follow' as RequestRedirect
      });

      if (!loginResp.ok) {
        const txt = await loginResp.text();
        throw new Error(`Login failed after account creation (${loginResp.status}) ${txt || ''}`);
      }

      const loginResult = await loginResp.json();
      console.log('👤 [PersonalSignIn][Backend] Login response', loginResult);

      if (!loginResult.plan_type || !loginResult.plan_type[0]) {
        throw new Error('Invalid login response - missing shop data');
      }

      // Store session (legacy behavior)
      sessionStorage.setItem('shop_name', loginResult.plan_type[0].shop_name || formData.name);
      sessionStorage.setItem('shop_code', loginResult.plan_type[0].shop_code);
      sessionStorage.setItem('plan_type', loginResult.plan_type[0].plan_type);
      sessionStorage.setItem('shop_token', loginResult.plan_type[0].shop_token);
      sessionStorage.setItem('user_id', auth0UserId);
      console.log('💾 [PersonalSignIn] Session data stored');

      posthog.identify(auth0UserId, {
        email: formData.email,
        name: formData.name,
        plan_type: loginResult.plan_type[0].plan_type,
        account_type: 'personal'
      });
      posthog.capture('personal_signup_completed', {
        plan_type: loginResult.plan_type[0].plan_type
      });

      // 5) Legacy redirect to QR onboard page
      const shopCode = loginResult.plan_type[0].shop_code;
      const onboardUrl = `${baseUrl}/qr/onboard/${shopCode}`;
      console.log('🎯 [PersonalSignIn] Redirecting to onboard URL', { onboardUrl });
      window.location.replace(onboardUrl);
    } catch (err: any) {
      posthog.capture('personal_signup_error', {
        error_message: err?.message || 'unknown'
      });
      posthog.captureException(err as Error);
      console.error('❌ [PersonalSignIn] Signup flow error', { message: err?.message, stack: err?.stack });
      const message =
        typeof err?.message === 'string' && err.message
          ? err.message
          : 'An error occurred during account creation. Please try again.';
      setError(message);
    } finally {
      console.log('🏁 [PersonalSignIn] Flow complete');
      setIsLoading(false);
    }
  };

  const content = (
    <div className="page-container" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/KOR_app_Logo.png"
            alt="KOR Logo"
            style={{ width: '80px', height: '80px', marginBottom: '1rem' }}
          />
          <h1 style={{ color: '#333', marginBottom: '0.5rem' }}>Create Personal Account</h1>
          <p style={{ color: '#666', marginBottom: '0' }}>
            Track your bike maintenance — secure login powered by Auth0
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffe6e6',
            color: '#d63031',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #d63031'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a secure password"
                required
                minLength={8}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <LegacyAuthGuard
      requiresAuth={true}
      onAuthorizationChange={(authorized) => console.log('[PersonalSignIn] Authorization status:', authorized)}
    >
      {content}
    </LegacyAuthGuard>
  );
};

export default PersonalSignIn;
