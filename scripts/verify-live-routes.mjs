import assert from "node:assert/strict";

const rawBase = process.env.SITE_URL ?? "http://localhost:3000";
const rawCanonicalBase = process.env.CANONICAL_SITE_URL ?? "https://dallascircle.com";
const rawWwwBase = process.env.WWW_SITE_URL ?? "https://www.dallascircle.com";
const base = new URL(rawBase.endsWith("/") ? rawBase : `${rawBase}/`);
const canonicalBase = new URL(rawCanonicalBase.endsWith("/") ? rawCanonicalBase : `${rawCanonicalBase}/`);
const wwwBase = new URL(rawWwwBase.endsWith("/") ? rawWwwBase : `${rawWwwBase}/`);

for (const [name, url] of [["SITE_URL", base], ["CANONICAL_SITE_URL", canonicalBase], ["WWW_SITE_URL", wwwBase]]) {
  assert.ok(["http:", "https:"].includes(url.protocol), `${name} must use HTTP or HTTPS.`);
  assert.equal(url.pathname, "/", `${name} must be an origin, without a path prefix.`);
  assert.equal(url.search, "", `${name} must not include a query string.`);
  assert.equal(url.hash, "", `${name} must not include a fragment.`);
}

async function getResponse(pathOrUrl) {
  const url = pathOrUrl instanceof URL ? pathOrUrl : new URL(pathOrUrl, base);
  return fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
}

async function getPage(pathOrUrl) {
  const response = await getResponse(pathOrUrl);
  const label = pathOrUrl instanceof URL ? pathOrUrl.pathname : pathOrUrl;
  assert.equal(response.status, 200, `${label} should return HTTP 200; got ${response.status}`);
  return response.text();
}

const wwwResponse = await getResponse(wwwBase);
assert.ok([301, 308].includes(wwwResponse.status), `www hostname must permanently redirect; got HTTP ${wwwResponse.status}`);
const wwwDestination = new URL(wwwResponse.headers.get("location") ?? "", wwwBase);
assert.equal(wwwDestination.origin, canonicalBase.origin, "www hostname must redirect to the canonical apex origin.");
assert.equal(wwwDestination.pathname, "/", "www homepage must redirect to the apex homepage.");
assert.equal(wwwDestination.protocol, "https:", "www hostname must redirect to HTTPS.");

const wwwPathProbe = new URL("/explore?redirect_probe=1", wwwBase);
const wwwPathResponse = await getResponse(wwwPathProbe);
assert.ok([301, 308].includes(wwwPathResponse.status), "www deep paths must use a permanent redirect.");
const wwwPathDestination = new URL(wwwPathResponse.headers.get("location") ?? "", wwwBase);
assert.equal(wwwPathDestination.origin, canonicalBase.origin, "www deep paths must redirect to the apex origin.");
assert.equal(wwwPathDestination.pathname, "/explore", "www redirect must preserve the request path.");
assert.equal(wwwPathDestination.search, "?redirect_probe=1", "www redirect must preserve the query string.");

function canonicalUrl(path) {
  return new URL(path, canonicalBase).href;
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
  const canonicalTags = tags.filter((tag) => getTagAttributes(tag).rel?.toLowerCase() === "canonical");
  assert.equal(canonicalTags.length, 1, `Expected exactly one canonical link for ${expectedUrl}; found ${canonicalTags.length}`);
  const href = getTagAttributes(canonicalTags[0]).href;
  assert.ok(href, `Canonical link has no href for ${expectedUrl}`);
  assert.equal(new URL(href, canonicalBase).href, expectedUrl, `Wrong canonical URL for ${expectedUrl}`);
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
  const types = blocks.flatMap((block) => block["@graph"] ?? [block]).flatMap((node) => {
    const value = node["@type"];
    return Array.isArray(value) ? value : value ? [value] : [];
  });
  assert.ok(
    expectedTypes.some((expected) => types.includes(expected)),
    `${label} should contain JSON-LD type ${expectedTypes.join(" or ")}; found ${types.join(", ") || "none"}`,
  );
}

function assertCanonicalEntityIds(html, path) {
  const expectedUrl = canonicalUrl(path);
  const blocks = getJsonLd(html, path);
  const entityIds = blocks.flatMap((block) => block["@graph"] ?? [block]).map((node) => node["@id"]).filter((value) => typeof value === "string");

  assert.ok(entityIds.length > 0, `Missing stable JSON-LD @id on ${path}`);
  for (const entityId of entityIds) {
    const parsed = new URL(entityId, canonicalBase);
    assert.equal(parsed.origin, canonicalBase.origin, `JSON-LD @id must use canonical origin on ${path}`);
    if (path.startsWith("/places/")) {
      assert.match(
        parsed.pathname,
        /^\/id\/place\/[0-9a-f-]{36}$/i,
        `Place @id must use its immutable UUID identity, independent of the mutable slug on ${path}`,
      );
    } else {
      assert.equal(parsed.href, expectedUrl, `Page @id must match the canonical page URL on ${path}`);
    }
    assert.ok(!parsed.href.toLowerCase().includes("praveenyadav"), `Personal-name URL is forbidden on ${path}`);
  }

  for (const block of blocks.flatMap((item) => item["@graph"] ?? [item])) {
    const mainEntity = block.mainEntityOfPage;
    const mainEntityId = typeof mainEntity === "string" ? mainEntity : mainEntity && typeof mainEntity === "object" ? mainEntity["@id"] : undefined;
    if (typeof mainEntityId === "string") {
      assert.equal(new URL(mainEntityId, canonicalBase).href, expectedUrl, `mainEntityOfPage must match the canonical page URL on ${path}`);
    }
  }
}
function getPageMetadata(html, label) {
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
  return { title, description };
}

function assertPageMetadata(html, label) {
  getPageMetadata(html, label);
}

function parseSitemap(xml) {
  const locations = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => match[1].trim().replaceAll("&amp;", "&"))
    .filter(Boolean);
  assert.ok(locations.length > 0, "Sitemap must contain at least one <loc> URL.");

  const urls = locations.map((location) => new URL(location));
  for (const url of urls) {
    assert.equal(url.origin, canonicalBase.origin, `Sitemap URL must use canonical origin ${canonicalBase.origin}: ${url.href}`);
    assert.ok(!url.href.toLowerCase().includes("praveenyadav"), `Sitemap must not expose a personal-name URL: ${url.href}`);
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

const guidePath = "/guides/three-deep-ellum-dinner-stops";
const explorePath = "/explore";
const neighborhoodPath = "/neighborhoods/deep-ellum";
const placePaths = [
  "/places/serious-pizza-deep-ellum",
  "/places/pecan-lodge-deep-ellum",
  "/places/armoury-deep-ellum",
];

const homepage = await getPage("/");
assertCanonical(homepage, canonicalUrl("/"));
assertPageMetadata(homepage, "/");
assertSchemaType(homepage, "/", ["Organization", "WebSite"]);
const homepageSchemas = getJsonLd(homepage, "/").flatMap((block) => block["@graph"] ?? [block]);
const organizationSchema = homepageSchemas.find((node) => node["@type"] === "Organization");
const websiteSchema = homepageSchemas.find((node) => node["@type"] === "WebSite");
assert.equal(organizationSchema?.["@id"], "https://dallascircle.com/#organization", "Homepage Organization schema must use the canonical identity.");
assert.equal(websiteSchema?.publisher?.["@id"], "https://dallascircle.com/#organization", "WebSite publisher must reference the canonical Organization identity.");
const homepageMeta = homepage.match(/<meta\b[^>]*>/gi) ?? [];
const homepageMetaAttributes = homepageMeta.map(getTagAttributes);
const ogImage = homepageMetaAttributes.find((attributes) => attributes.property?.toLowerCase() === "og:image")?.content;
const twitterImage = homepageMetaAttributes.find((attributes) => attributes.name?.toLowerCase() === "twitter:image")?.content;
assert.ok(ogImage, "Homepage must expose an Open Graph image.");
assert.ok(twitterImage, "Homepage must expose a Twitter image.");
const socialImageUrl = new URL(ogImage, canonicalBase);
const socialImageResponse = await getResponse(new URL(socialImageUrl.pathname + socialImageUrl.search, base));
assert.equal(socialImageResponse.status, 200, "Generated social preview image must return HTTP 200.");
assert.ok((socialImageResponse.headers.get("content-type") ?? "").toLowerCase().includes("image/png"), "Generated social preview must return PNG.");
assert.ok(homepage.includes(guidePath), "Homepage should link to the first guide.");
assert.ok(homepage.includes(neighborhoodPath), "Homepage should link to the eligible Deep Ellum neighborhood page.");
assert.ok(homepage.includes(explorePath), "Homepage should link to the editorial explore hub.");
assert.ok(!homepage.toLowerCase().includes("php rescue"), "Homepage must not promote retired PHP services.");

const explore = await getPage(explorePath);
assertCanonical(explore, canonicalUrl(explorePath));
assertPageMetadata(explore, explorePath);
assert.ok(explore.includes("Search the verified collection"), "Explore should expose the accessible collection search.");
assert.ok(explore.includes("Search places, guides, and neighborhoods"), "Explore search should have an accessible search label.");
assert.ok(explore.includes("Everything") && explore.includes("Neighborhoods") && explore.includes("Guides") && explore.includes("Places"), "Explore should expose all content-type filters.");
assert.ok(explore.includes("Place category") && explore.includes("All categories"), "Explore should expose structured place-category filtering.");
assert.ok(explore.includes("Price level") && explore.includes("Any price level"), "Explore should expose structured price-level filtering.");
assertSchemaType(explore, explorePath, ["CollectionPage"]);
assertCanonicalEntityIds(explore, explorePath);
assert.ok(explore.includes(neighborhoodPath), "Explore hub should link to the eligible neighborhood page.");
assert.ok(explore.includes(guidePath), "Explore hub should link to the reviewed guide.");
for (const path of placePaths) {
  assert.ok(explore.includes(path), `Explore hub should link to eligible canonical profile ${path}`);
}

const neighborhood = await getPage(neighborhoodPath);
assertCanonical(neighborhood, canonicalUrl(neighborhoodPath));
assertPageMetadata(neighborhood, neighborhoodPath);
assertSchemaType(neighborhood, neighborhoodPath, ["CollectionPage"]);
assertCanonicalEntityIds(neighborhood, neighborhoodPath);
const neighborhoodSchemas = getJsonLd(neighborhood, neighborhoodPath);
const neighborhoodSchema = neighborhoodSchemas.find((block) => block["@type"] === "CollectionPage");
assert.ok(neighborhoodSchema, "Neighborhood page should expose CollectionPage schema.");
assert.equal(
  neighborhoodSchema.about?.["@id"],
  `${canonicalUrl(neighborhoodPath)}#place`,
  "Neighborhood Place entity should have a stable identity distinct from the CollectionPage URL.",
);
const placeEntityIdsByPath = new Map();
for (const path of placePaths) {
  const html = await getPage(path);
  const placeSchemas = getJsonLd(html, path);
  const placeSchema = placeSchemas.find((block) => ["Restaurant", "BarOrPub", "LocalBusiness"].some((type) => {
    const schemaType = block["@type"];
    return Array.isArray(schemaType) ? schemaType.includes(type) : schemaType === type;
  }));
  assert.ok(placeSchema && typeof placeSchema["@id"] === "string", `Place profile must expose its stable entity ID on ${path}`);
  placeEntityIdsByPath.set(path, placeSchema["@id"]);
}
const neighborhoodItems = neighborhoodSchema.mainEntity?.itemListElement ?? [];
for (const path of placePaths) {
  assert.ok(
    neighborhoodItems.some((item) => item.item?.["@id"] === placeEntityIdsByPath.get(path)),
    `Neighborhood ItemList should reference the same stable place entity ID as ${path}`,
  );
}
for (const path of placePaths) {
  assert.ok(neighborhood.includes(path), `${neighborhoodPath} should link to eligible canonical profile ${path}`);
}

const guide = await getPage(guidePath);
assertCanonical(guide, canonicalUrl(guidePath));
assertPageMetadata(guide, guidePath);
assertSchemaType(guide, guidePath, ["Article"]);
assertCanonicalEntityIds(guide, guidePath);
const guideSchemas = getJsonLd(guide, guidePath);
const guidePlaceEntityIds = guideSchemas.flatMap((block) =>
  Array.isArray(block.about) ? block.about.map((entity) => entity && typeof entity === "object" ? entity["@id"] : undefined) : [],
).filter((value) => typeof value === "string");
for (const path of placePaths) {
  assert.ok(
    guidePlaceEntityIds.includes(placeEntityIdsByPath.get(path)),
    `Guide JSON-LD should reference the same stable place entity ID as ${path}`,
  );
}

for (const path of placePaths) {
  const html = await getPage(path);
  assertCanonical(html, canonicalUrl(path));
  assertPageMetadata(html, path);
  assertSchemaType(html, path, ["Restaurant", "BarOrPub", "LocalBusiness"]);
  assertCanonicalEntityIds(html, path);
  const placeSchemas = getJsonLd(html, path);
  const placeSchema = placeSchemas.find((block) => ["Restaurant", "BarOrPub", "LocalBusiness"].some((type) => {
    const schemaType = block["@type"];
    return Array.isArray(schemaType) ? schemaType.includes(type) : schemaType === type;
  }));
  assert.ok(placeSchema, `Missing local-business entity schema on ${path}`);
  const stableEntityId = new URL(placeSchema["@id"]);
  assert.match(stableEntityId.pathname, /^\/id\/place\/[0-9a-f-]{36}$/i, `Place @id must be UUID-based on ${path}`);
  const identityResponse = await getResponse(new URL(stableEntityId.pathname, base));
  assert.equal(identityResponse.status, 308, `Stable place identity should permanently resolve to its canonical profile on ${path}`);
  assert.equal(
    new URL(identityResponse.headers.get("location") ?? "", base).pathname,
    path,
    `Stable place identity should redirect to the current canonical profile on ${path}`,
  );
  assert.equal(
    new URL(typeof placeSchema.mainEntityOfPage === "string" ? placeSchema.mainEntityOfPage : placeSchema.mainEntityOfPage?.["@id"], canonicalBase).href,
    canonicalUrl(path),
    `Place schema mainEntityOfPage must identify the canonical DallasCircle profile on ${path}`,
  );
  assert.ok(html.includes("hello@dallascircle.com"), `${path} should expose the correction contact.`);
  assert.ok(html.includes("Source checked"), `${path} should show source freshness context.`);
  assert.ok(html.includes("Source for this detail:"), `${path} should show the source attached to each verified fact.`);
  assert.ok(html.includes(guidePath), `${path} should link to the relevant published guide when the place is featured in it.`);
}

const robots = await getPage("/robots.txt");
assert.match(robots, /User-agent:\s*\*/i, "robots.txt should define default crawler rules.");
assert.match(robots, /User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i, "robots.txt should explicitly allow OAI-SearchBot.");
assert.ok(robots.includes(canonicalUrl("/sitemap.xml")), "robots.txt should reference the canonical sitemap URL.");

const sitemapXml = await getPage("/sitemap.xml");
const sitemapUrls = parseSitemap(sitemapXml);
const sitemapPaths = new Set(sitemapUrls.map((url) => url.pathname));
for (const path of ["/", "/about", "/faq", explorePath, guidePath, neighborhoodPath, ...placePaths]) {
  assert.ok(sitemapPaths.has(path), `Sitemap should include required published route ${path}`);
}

const guideSitemapPaths = [...sitemapPaths].filter((path) => path.startsWith("/guides/"));
assert.ok(guideSitemapPaths.length >= 2, `Expected both published guide pages in sitemap; found ${guideSitemapPaths.length}`);
for (const path of guideSitemapPaths) {
  const html = await getPage(path);
  assertCanonical(html, canonicalUrl(path));
  assertPageMetadata(html, path);
  assertSchemaType(html, path, ["Article"]);
  assertCanonicalEntityIds(html, path);
}

const crawledHtml = new Map();
const seenTitles = new Map();
const seenDescriptions = new Map();
for (const sitemapUrl of sitemapUrls) {
  const html = await getPage(sitemapUrl.pathname);
  assertCanonical(html, canonicalUrl(sitemapUrl.pathname));
  const metadata = getPageMetadata(html, sitemapUrl.pathname);

  const previousTitlePath = seenTitles.get(metadata.title);
  assert.ok(!previousTitlePath, `Duplicate page title on ${sitemapUrl.pathname} and ${previousTitlePath}`);
  seenTitles.set(metadata.title, sitemapUrl.pathname);

  const previousDescriptionPath = seenDescriptions.get(metadata.description);
  assert.ok(!previousDescriptionPath, `Duplicate meta description on ${sitemapUrl.pathname} and ${previousDescriptionPath}`);
  seenDescriptions.set(metadata.description, sitemapUrl.pathname);

  crawledHtml.set(sitemapUrl.pathname, html);
}

const internalPaths = new Set([...crawledHtml.values()].flatMap(getLocalLinkPaths));
for (const path of internalPaths) {
  let currentUrl = new URL(path, base);
  const visited = new Set();
  let response = await getResponse(currentUrl);

  for (let hop = 0; [301, 308].includes(response.status); hop += 1) {
    assert.ok(hop < 5, `Internal link ${path} exceeded the maximum of five redirects.`);
    assert.ok(!visited.has(currentUrl.href), `Internal link ${path} contains a redirect loop at ${currentUrl.href}`);
    visited.add(currentUrl.href);

    const location = response.headers.get("location");
    assert.ok(location, `Redirect from ${currentUrl.pathname} must include a Location header.`);
    currentUrl = new URL(location, currentUrl);
    assert.ok(!visited.has(currentUrl.href), `Internal link ${path} redirects in a loop to ${currentUrl.href}`);
    response = await getResponse(currentUrl);
  }

  assert.equal(
    response.status,
    200,
    `Internal link ${path} must resolve to HTTP 200 within five redirects; got ${response.status} at ${currentUrl.pathname}`,
  );
}

const historicalPlaceSlug = process.env.HISTORICAL_PLACE_SLUG;
if (historicalPlaceSlug) {
  const historicalPath = `/places/${historicalPlaceSlug}`;
  const historicalResponse = await getResponse(historicalPath);
  assert.ok(
    [301, 308].includes(historicalResponse.status),
    `Historical place slug ${historicalPlaceSlug} should permanently redirect; got ${historicalResponse.status}`,
  );
  const historicalDestination = new URL(historicalResponse.headers.get("location") ?? "", base);
  assert.match(historicalDestination.pathname, /^\/places\/[a-z0-9-]+$/i, "Historical slug must redirect to a current canonical place route.");
  assert.notEqual(historicalDestination.pathname, historicalPath, "Historical slug must not redirect to itself.");
}

const retiredPath = "/php-rescue";
const redirect = await getResponse(retiredPath);
assert.ok([301, 308].includes(redirect.status), `${retiredPath} should permanently redirect; got ${redirect.status}`);
assert.equal(new URL(redirect.headers.get("location") ?? "", base).pathname, "/", "Retired path should redirect to the homepage.");

console.log(
  `Route verification passed for app origin ${base.origin} using canonical origin ${canonicalBase.origin}: ${sitemapUrls.length} sitemap URLs and ${internalPaths.size} internal link paths checked.`,
);
