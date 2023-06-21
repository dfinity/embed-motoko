import isEmbedded from './utils/isEmbedded';

// Redirect to custom domain
if (
  !isEmbedded &&
  (window.location.hostname.endsWith('.icp0.io') ||
    window.location.hostname.endsWith('.ic0.app'))
  // || window.location.hostname === 'embed.smartcontracts.org')
) {
  window.location.hostname = 'embed.motoko.org';
}
