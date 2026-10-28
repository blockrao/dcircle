import assert from "node:assert/strict";

const rawBase = process.env.SITE_URL ?? "https://dallascircle.com";
const base = new URL(rawBase.endsWith("/") ? rawBase : `${rawBase}/`);

async function getPage(path) {
  const response = await fetch(new URL(path, base), { redirect: "manual" });
  assert.equal(response.status, 200, `${path} should return HTTP 200; got ${response.status}`);
  return response.text();
}

function assertCanonical(html, path) {
  const tags = html.match(/<link\\b[^>]*>/g) ?? [];
  const canonicalTag = tags.find((tag) => /\\brel="canonical"/.test(tag));
  assert.ok(canonicalTag, `Missing canonical link for ${path}`);
  const href = canonicalTag.match(/\\bhref="([^"]+)"/)?.[1];
  assert.equal(href, new URL(path, base).href, `Wrong canonical URL for ${path}`);
}

const homepage = await getPage("/");
assertCanonical(homepage, "/");
assert.ok(homepage.includes("/guides/three-deep-ellum-dinner-stops"), "Homepage should link to the first guide.");
assert.ok(!homepage.toLowerCase().includes("php rescue"), "Homepage must not promote retired PHP services.");

const guidePath = "/guides/three-deep-ellum-dinner-stops";
const guide = await getPage(guidePath);
assertCanonical(guide, guidePath);
assert.ok(guide.includes('"@type":"Article"'), "Guide should contain Article JSON-LD.");
for (const path of [
  "/places/serious-pizza-deep-ellum",
  "/places/pecan-lodge-deep-ellum",
  "/places/armoury-deep-ellum",
]) {
  const html = await getPage(path);
  assertCanonical(html, path);
  assert.ok(html.includes('"@type":"Restaurant"') || html.includes('"@type":"BarOrPub"') || html.includes('"@type":"LocalBusiness"'), `${path} should contain local-business JSON-LD.`);
  assert.ok(html.includes("hello@dallascircle.com"), `${path} should expose the correction contact.`);
  assert.ok(html.includes("Source checked"), `${path} should show source freshness context.`);
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", base), { redirect: "manual" });
assert.equal(sitemapResponse.status, 200, "Sitemap should return HTTP 200.");
const sitemap = await sitemapResponse.text();
assert.ok(sitemap.includes(new URL(guidePath, base).href), "Sitemap should include the published guide.");
for (const path of [
  "/places/serious-pizza-deep-ellum",
  "/places/pecan-lodge-deep-ellum",
  "/places/armoury-deep-ellum",
]) {
  assert.ok(sitemap.includes(new URL(path, base).href), `Sitemap should include ${path}`);
}

const retiredPath = "/php-rescue";
const redirect = await fetch(new URL(retiredPath, base), { redirect: "manual" });
assert.ok([301, 308].includes(redirect.status), `${retiredPath} should permanently redirect; got ${redirect.status}`);
assert.equal(new URL(redirect.headers.get("location") ?? "", base).pathname, "/", "Retired path should redirect to the homepage.");

console.log(`Live route verification passed for ${base.origin}`);
