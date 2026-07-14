import posthog from 'posthog-js'

export const initPostHog = () => {
  // Initialize PostHog in production by default, or when explicitly enabled in development
  const shouldInitialize = process.env.NODE_ENV === 'production' || process.env.REACT_APP_POSTHOG_ENABLED === 'true'
  
  if (typeof window !== 'undefined' && shouldInitialize) {
    posthog.init(process.env.REACT_APP_POSTHOG_KEY || '', {
      api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com',
      // api_host is now our reverse proxy (k.jmrcycling.com), which only handles
      // ingestion — the dashboard/toolbar UI is still served from PostHog itself.
      ui_host: 'https://us.posthog.com',
      person_profiles: 'identified_only',
      // Without this, PostHog only captures a pageview on the initial hard load —
      // client-side route changes (e.g. Articles index -> article, or article -> article)
      // via react-router never fire a new pageview.
      capture_pageview: 'history_change',
      // Explicitly enable session recording
      disable_session_recording: false,
      // Enable debug mode in development
      debug: process.env.NODE_ENV === 'development',
      loaded: (posthog) => {
        console.log('✅ PostHog loaded successfully', {
          environment: process.env.NODE_ENV,
          host: window.location.host,
          sessionRecordingEnabled: !posthog.config.disable_session_recording
        })
      }
    })
  } else {
    console.log('🚫 PostHog not initialized', {
      windowAvailable: typeof window !== 'undefined',
      shouldInitialize,
      enabled: process.env.REACT_APP_POSTHOG_ENABLED,
      environment: process.env.NODE_ENV
    })
  }
}

export default posthog