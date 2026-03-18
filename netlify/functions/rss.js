// netlify/functions/rss.js
// RSSフィードをプロキシ取得してCORSヘッダーを付与する

const FEEDS = {
  // note ハッシュタグ
  'note-ballroom':     'https://note.com/hashtag/%E7%AB%B6%E6%8A%80%E3%83%80%E3%83%B3%E3%82%B9.rss',
  'note-social-dance': 'https://note.com/hashtag/%E7%A4%BE%E4%BA%A4%E3%83%80%E3%83%B3%E3%82%B9.rss',
  'note-dancesport':   'https://note.com/hashtag/%E3%83%80%E3%83%B3%E3%82%B9%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84.rss',
  'note-waltz':        'https://note.com/hashtag/%E3%83%AF%E3%83%AB%E3%83%84.rss',
  'note-latin':        'https://note.com/hashtag/%E3%83%A9%E3%83%86%E3%83%B3%E3%83%80%E3%83%B3%E3%82%B9.rss',
  // 専門メディア
  'danceview':         'https://www.danceview.co.jp/feed/',
  'maekake':           'https://socialdance.asia/feed/',
};

exports.handler = async (event) => {
  const id = event.queryStringParameters?.id;
  const url = FEEDS[id];

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'unknown feed id: ' + id }),
    };
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BallroomDanceInput/1.0; +https://ballroom-dance-input.netlify.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(10000),
    });

    const xml = await res.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=900', // 15分キャッシュ
      },
      body: xml,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
