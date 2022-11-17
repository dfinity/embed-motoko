const BASE_URL = 'https://embed.smartcontracts.org';

exports.handler = async (event, context) => {
  const query = event.queryStringParameters;
  const url = decodeURIComponent(query.url || '');
  if (
    !url ||
    !url.startsWith(BASE_URL) ||
    url.startsWith(`${BASE_URL}/api`) ||
    url.includes('.', BASE_URL.length)
  ) {
    return {
      statusCode: 400,
      body: 'Invalid embed link',
    };
  }
  const format = query.format;
  const defaultWidth = 800;
  const width = +query.maxwidth || defaultWidth;
  let height = +query.maxheight || 500;
  try {
    const match = /[?&]lines=([0-9]+)/.exec(url);
    if (match) {
      const [, lineCount] = match;
      height = Math.min(120 + lineCount * 24, height);
    }
  } catch (err) {
    console.error(err);
  }
  height = Math.round(height * (defaultWidth / width)); // Fix iframe height in Medium articles

  const result = {
    version: '1.0',
    provider_name: 'Embed Motoko',
    provider_url: 'https://embed.smartcontracts.org',
    type: 'rich',
    width,
    height,
    html: `<iframe src=${JSON.stringify(
      url,
    )} width="${width}" height="${height}" style="border:0" />`,
  };
  return {
    statusCode: 200,
    body: format === 'xml' ? getXML(result) : JSON.stringify(result),
    headers: {
      'Content-Type': format === 'xml' ? 'text/xml' : 'application/json',
    },
  };
};

const getXML = (result) => {
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?><oembed>${Object.entries(
    result,
  )
    .map(([k, v]) => `<${k}>${encodeXML(v)}</${k}>`)
    .join('')}</oembed>`;
};

const encodeXML = (value) => {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
