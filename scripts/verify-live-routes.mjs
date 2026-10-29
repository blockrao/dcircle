import assert from "node:assert/strict";

const rawBase = process.env.SITE_URL ?? "http://localhost:3000";
const base = new URL(rawBase.endsWith("/") ? rawBase : `${rawBase}/`);

assert.ok(["http:", "https:"].includes(base.protocol), "SITE_URL must use HTTP or HTTPS.");
assert.equal(base.pathname, "/", "SITE_URL must be an origin, without a path prefix.");
assert.equal(base.search, "", "SITE_URL must not include a query string.");
assert.equal(base.hash, "", "SITE_URL must not include a fragment.");

const requestOptions = {
  redirect: "manual",
  signal: AbortSignal.timeout(15_000),
};

async function getResponse(pathOrUrl) {
  const url = pathOrUrl instanceof URL ? pathOrUrl : new URL(pathOrUrl, base);
  return fetch(url, requestOptions);
}

async function getPage(pathOrUrl) {
  const response = await getResponse(pathOrUrl);
  const label = pathOrUrl instanceof URL ? pathOrUrl.pathname : pathOrUrl;
  assert.equal(response.status, 200, `${label} should return HTTP 200; got ${response.status}`);
  return response.text();
}

function getTagAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
      match[1].toLowerCase(),
      match[2] ?? match[3] ?? "",
    ]),
  );
}

function assertCanonical(html, expectedUrl) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = tags.find((tag) => getTagAttributes(tag).rel?.toLowerCase() === "canonical");
  assert.ok(canonicalTag, `Missing canonical link for ${expectedUrl}`);
  const href = getTagAttributes(canonicalTag).href;
  assert.ok(href, `Canonical link has no href for ${expectedUrl}`);
  assert.equal(new URL(href, base).href, expectedUrl, `Wrong canonical URL for ${expectedUrl}`);
}

function getJsonLd(html, label) {
  const scripts = [
    ...html.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi),
  ];
  assert.ok(scripts.length > 0, `Missing JSON-LD on ${label}`);
  return scripts.map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`Invalid JSON-LD on ${label}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

function assertSchemaType(html, label, expectedTypes) {
  const blocks = getJsonLd(html, label);
  const types = blocks.flatMap((block) => {
    const value = block["@type"];
    return Array.isArray(value) ? value : value ? [value] : [];
  });
  assert.ok(
    expectedTypes.some((expected) => types.includes(expected)),
    `${label} should contain JSON-LD type ${expectedTypes.join(" or ")}; found ${types.join(", ") || "none"}`,
  );
}

function assertPageMetadata(html, label) {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  assert.ok(title, `Missing document title on ${label}`);
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const description = metaTags
    .map(getTagAttributes)
    .find((attributes) => attributes.name?.toLowerCase() === "description")?.content;
  assert.ok(description?.trim(), `Missing meta description on ${label}`);
  const robots = metaTags
    .map(getTagAttributes)
    .filter((attributes) => attributes.name?.toLowerCase() === "robots")
    .map((attributes) => attributes.content ?? "")
    .join(" ");
  assert.ok(!/\bnoindex\b/i.test(robots), `Sitemap URL ${label} must not be marked noindex`);
}

function parseSitemap(xml) {
  const locations = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => match[1].trim().replaceAll("&amp;", "&"))
    .filter(Boolean);
  assert.ok(locations.length > 0, "Sitemap must contain at least one <loc> URL.");

  const urls = locations.map((location) => new URL(location));
  for (const url of urls) {
    assert.equal(url.origin, base.origin, `Sitemap URL must use canonical origin ${base.origin}: ${url.href}`);
    assert.equal(url.search, "", `Sitemap URL must not contain query parameters: ${url.href}`);
    assert.equal(url.hash, "", `Sitemap URL must not contain a fragment: ${url.href}`);
  }

  assert.equal(new Set(urls.map((url) => url.href)).size, urls.length, "Sitemap must not contain duplicate URLs.");
  return urls;
}

function getLocalLinkPaths(html) {
  const anchors = html.match(/<a\b[^>]*>/gi) ?? [];
  const paths = new Set();

  for (const anchor of anchors) {
    const href = getTagAttributes(anchor).href;
    if (!href || href.startsWith("#")) continue;

    let url;
    try {
      url = new URL(href.replaceAll("&amp;", "&"), base);
    } catch {
      continue;
    }

    if (url.origin !== base.origin) continue;
    paths.add(url.pathname);
  }

  return [...paths];
}

const homepagePath = "/";
const guidePath = "/guides/three-deep-ellum-dinner-stops";
const placePaths = [
  "/places/serious-pizza-deep-ellum",
  "/places/pecan-lodge-deep-ellum",
  "/places/armoury-deep-ellum",
];

const homepage = await getPage(homepagePath);
assertCanonical(homepage, new URL(homepagePath, base).href);
assertPageMetadata(homepage, homepagePath);
assert.ok(homepage.includes(guidePath), "Homepage should link to the first guide.");
assert.ok(!homepage.toLowerCase().includes("php rescue"), "Homepage must not promote retired PHP services.");

const guide = await getPage(guidePath);
assertCanonical(guide, new URL(guidePath, base).href);
assertPageMetadata(guide, guidePath);
assertSchemaType(guide, guidePath, ["Article"]);

for (const path of placePaths) {
  const html = await getPage(path);
  assertCanonical(html, new URL(path, base).href);
  assertPageMetadata(html, path);
  assertSchemaType(html, path, ["Restaurant", "BarOrPub", "LocalBusiness"]);
  assert.ok(html.includes("hello@dallascircle.com"), `${path} should expose the correction contact.`);
  assert.ok(html.includes("Source checked"), `${path} should show source freshness context.`);
}

const robots = await getPage("/robots.txt");
assert.match(robots, /User-agent:\s*\*/i, "robots.txt should define default crawler rules.");
assert.match(robots, /User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i, "robots.txt should explicitly allow OAI-SearchBot.");
assert.ok(robots.includes(new URL("/sitemap.xml", base).href), "robots.txt should reference the canonical sitemap URL.");

const sitemapXml = await getPage("/sitemap.xml");
const sitemapUrls = parseSitemap(sitemapXml);
const sitemapSet = new Set(sitemapUrls.map((url) => url.pathname));
for (const path of ["/", "/about", "/faq", guidePath, ...placePaths]) {
  assert.ok(sitemapSet.has(path), `Sitemap should include required published route ${path}`);
}

const crawledHtml = new Map();
for (const url of sitemapUrls) {
  const html = url.pathname === "/"
    ? homepage
    : url.pathname === guidePath
      ? guide
      : placePaths.includes(url.pathname)
        ? await getPage(url)
        : await getPage(url);
  assertCanonical(html, url.href);
  assertPageMetadata(html, url.pathname);
  crawledHtml.set(url.pathname, html);
}

const internalPaths = new Set([...crawledHtml.values()].flatMap(getLocalLinkPaths));
for (const path of internalPaths) {
  const response = await getResponse(path);
  assert.ok(
    [200, 301, 308].includes(response.status),
    `Internal link ${path} should return 200 or a permanent redirect; got ${response.status}`,
  );
  if ([301, 308].includes(response.status)) {
    const location = response.headers.get("location");
    assert.ok(location, `Redirect from ${path} must include a Location header.`);
    assert.notEqual(new URL(location, base).pathname, path, `Redirect from ${path} must not loop to itself.`);
  }
}

const retiredPath = "/php-rescue";
const redirect = await getResponse(retiredPath);
assert.ok([301, 308].includes(redirect.status), `${retiredPath} should permanently redirect; got ${redirect.status}`);
assert.equal(new URL(redirect.headers.get("location") ?? "", base).pathname, "/", "Retired path should redirect to the homepage.");

console.log(
  `Route verification passed for ${base.origin}: ${sitemapUrls.length} sitemap URLs and ${internalPaths.size} internal link paths checked.`,
);
