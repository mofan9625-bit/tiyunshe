const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(projectRoot, 'sitemap.xml');
const endpoint = 'https://api.indexnow.org/indexnow';

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function readIndexNowKey() {
  const keyFiles = fs
    .readdirSync(projectRoot)
    .filter((name) => /^[a-f0-9]{32}\.txt$/i.test(name));

  if (keyFiles.length !== 1) {
    throw new Error(`Expected exactly one 32-character IndexNow key file, found ${keyFiles.length}.`);
  }

  const fileName = keyFiles[0];
  const key = fs.readFileSync(path.join(projectRoot, fileName), 'utf8').trim();
  const fileKey = path.basename(fileName, '.txt');

  if (key !== fileKey) {
    throw new Error(`IndexNow key file content must match its filename: ${fileName}`);
  }

  return key;
}

function readSitemapUrls() {
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap not found: ${sitemapPath}`);
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()))
    .filter(Boolean);

  if (urls.length === 0) {
    throw new Error('No URLs were found in sitemap.xml.');
  }

  if (urls.length > 10000) {
    throw new Error(`IndexNow accepts at most 10,000 URLs per request; found ${urls.length}.`);
  }

  return [...new Set(urls)];
}

async function submit() {
  const key = readIndexNowKey();
  const urlList = readSitemapUrls();
  const firstUrl = new URL(urlList[0]);
  const host = firstUrl.host;

  for (const url of urlList) {
    if (new URL(url).host !== host) {
      throw new Error(`All sitemap URLs must use the same host (${host}): ${url}`);
    }
  }

  const payload = {
    host,
    key,
    keyLocation: `${firstUrl.protocol}//${host}/${key}.txt`,
    urlList,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text();
  console.log(`IndexNow response: ${response.status} ${response.statusText}`);
  console.log(`Submitted ${urlList.length} URLs for ${host}.`);

  if (responseBody) {
    console.log(responseBody);
  }

  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow submission failed with HTTP ${response.status}.`);
  }
}

submit().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
