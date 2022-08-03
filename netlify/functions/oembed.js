exports.handler = async (event, context) => {
  const query = event.queryStringParameters;
  const url = decodeURIComponent(query.url || '');
  if (!url || !url.startsWith('https://embed.smartcontracts.org')) {
    return {
      statusCode: 400,
      body: 'Invalid URL',
    };
  }
  const width = +query.maxwidth || 800;
  const height = +query.maxheight || 500;
  const format = query.format;

  const result = {
    version: '1.0',
    provider_name: 'Embed Motoko',
    provider_url: 'https://embed.smartcontracts.org',
    type: 'rich',
    width,
    height,
    html: `<iframe src=${JSON.stringify(
      url,
    )} style="width:${width}px; height:${height}px; border:0" />`,
  };
  return {
    statusCode: 200,
    body: format === 'xml' ? getXML(result) : JSON.stringify(result),
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
