// netlify/functions/ogp.js
// 記事URLからOGP画像を取得するサーバーレス関数

exports.handler = async (event) => {
  const url = event.queryStringParameters?.url;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'url required' }) };
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BallroomDanceInput/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    // OGP画像を抽出
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

    const image = ogImage ? ogImage[1] : null;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ image }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: null }),
    };
  }
};
