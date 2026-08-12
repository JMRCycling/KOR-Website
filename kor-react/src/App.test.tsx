import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Left-over create-react-app boilerplate previously asserted on "learn
// react" — text that has never existed in this app's actual homepage.
// Assert on real, stable homepage copy instead. "Never let maintenance..."
// is a plain <h2>, not run through the word-splitting SplitText animation
// component, so it's a single stable text node to query against.
test('renders the homepage hero subtitle', () => {
  render(<App />);
  const subtitle = screen.getByText(/never let maintenance keep you from riding again/i);
  expect(subtitle).toBeInTheDocument();
});
