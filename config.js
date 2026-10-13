// Public configuration only. Never place API keys or payment secrets in this file.
// An empty endpoint keeps the site in a clearly marked local draft mode.
// See docs/INTEGRATION.md for the server response and payment contract.
export const config = Object.freeze({
  mode: 'demo',
  bookingEndpoint: '',
  orderEndpoint: '',
  contactEmail: '',
  liveSchedule: [],
  requestTimeoutMs: 15000,
});
