// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (the test environment react-scripts uses) doesn't implement
// TextEncoder/TextDecoder, but react-router v7 references them at module
// load time. Node's own `util` module has real implementations available
// in the Jest process — this just exposes them as globals for jsdom code.
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// jsdom also doesn't implement the Web Crypto API (window.crypto.subtle),
// which @auth0/auth0-spa-js requires at construction time for its PKCE flow.
// Node has had a spec-compliant implementation since v15 via crypto.webcrypto.
const { webcrypto } = require('crypto');
if (typeof global.crypto === 'undefined' || !global.crypto.subtle) {
  global.crypto = webcrypto;
}

// jsdom implements neither IntersectionObserver nor window.matchMedia, both
// used by the site's scroll/motion components (CountUp, SplitText,
// ScrollAnimations, ScrollImageSequence). Minimal stubs are enough here —
// tests just need components to mount without crashing, not real
// scroll-triggered behavior.
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
