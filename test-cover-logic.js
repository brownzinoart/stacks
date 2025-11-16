function isRealCover(url) {
  if (!url || url.startsWith('gradient:') || url.includes('from-') || url.includes('to-')) {
    return false;
  }
  
  if (url.includes('/api/cover-proxy?url=')) {
    try {
      const proxiedUrl = decodeURIComponent(url.split('url=')[1] || '');
      console.log('Proxied URL:', proxiedUrl);
      return proxiedUrl.includes('covers.openlibrary.org') ||
             proxiedUrl.includes('books.google.com') ||
             proxiedUrl.includes('googleusercontent.com') ||
             proxiedUrl.includes('googleapis.com') ||
             proxiedUrl.includes('archive.org');
    } catch (e) {
      console.log('Error decoding:', e.message);
      return false;
    }
  }
  
  return url.startsWith('http') && (
    url.includes('covers.openlibrary.org') ||
    url.includes('books.google.com') ||
    url.includes('ia.media-imager.archive.org') ||
    url.includes('coverartarchive.org') ||
    url.includes('image.tmdb.org') ||
    url.includes('secure.gravatar.com') ||
    url.includes('imgur.com') ||
    url.includes('amazonaws.com')
  );
}

const testUrls = [
  '/api/cover-proxy?url=https%3A%2F%2Fbooks.google.com%2Fbooks%2Fcontent%3Fid%3DnjVpDQAAQBAJ%26printsec%3Dfrontcover%26img%3D1%26zoom%3D0%26source%3Dgbs_api',
  'gradient:from-pink-400:to-purple-600',
  'https://covers.openlibrary.org/b/id/10471875-L.jpg'
];

testUrls.forEach(url => {
  console.log(`URL: ${url.substring(0, 60)}...`);
  console.log(`Real: ${isRealCover(url) ? '✅' : '❌'}`);
  console.log('---');
});