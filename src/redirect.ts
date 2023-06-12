// Redirect to custom domain
if (
  window.location.hostname.endsWith('.icp0.io') ||
  window.location.hostname.endsWith('.ic0.app') ||
  window.location.hostname === 'embed.smartcontracts.org'
) {
  window.location.hostname = 'embed.motoko.org';
}
