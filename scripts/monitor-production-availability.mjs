const origin = process.env.SITE_URL ?? "https://dallascircle.com";
const routes = [
  { path: "/", kind: "html" },
  { path: "/explore", kind: "html" },
  { path: "/places/serious-pizza-deep-ellum", kind: "html" },
  { path: "/places/pecan-lodge-deep-ellum", kind: "html" },
  { path: "/guides/three-deep-ellum-dinner-stops", kind: "html" },
  { path: "/robots.txt", kind: "text" },
  { path: "/sitemap.xml", kind: "xml" },
];

const failures = [];
const results = [];

async function check(path, kind) {
  const url = new URL(path, origin);
  const started = performance.now();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "DallasCircle-Production-Monitor/1.0" },
    });
    const body = await response.text();
    const elapsedMs = Math.round(performance.now() - started);
    const contentType = response.headers.get("content-type") ?? "";
    const problems = [];

    if (!response.ok) problems.push(`HTTP ${response.status}`);
    if (new URL(response.url).origin !== new URL(origin).origin) problems.push(`unexpected final origin ${new URL(response.url).origin}`);
    if (kind === "html" && !contentType.toLowerCase().includes("text/html")) problems.push(`unexpected content-type ${contentType || "(missing)"}`);
    if (kind === "html" && !/<html[\s>]/i.test(body)) problems.push("response does not contain an HTML document");
    if (kind === "xml" && !/xml/i.test(contentType) && !/<(?:\?xml|urlset|sitemapindex)/i.test(body)) problems.push("response does not look like XML");
    if (body.length < (kind === "html" ? 500 : 20)) problems.push(`response body suspiciously small (${body.length} bytes)`);

    const result = { path, status: response.status, elapsedMs, bytes: body.length, contentType, problems };
    results.push(result);
    if (problems.length) failures.push(result);

    if (path === "/" && response.ok) {
      const asset = body.match(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+\.(?:js|css)(?:\?[^"']*)?)["']/i)?.[1];
      if (asset) await checkAsset(new URL(asset, origin));
      else failures.push({ path: "/", problems: ["no Next.js static JS/CSS asset reference found in homepage HTML"] });
    }
  } catch (error) {
    const result = { path, elapsedMs: Math.round(performance.now() - started), problems: [error instanceof Error ? error.message : String(error)] };
    results.push(result);
    failures.push(result);
  }
}

async function checkAsset(url) {
  const started = performance.now();
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
    const bytes = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "";
    const problems = [];
    if (!response.ok) problems.push(`HTTP ${response.status}`);
    if (bytes.byteLength < 100) problems.push(`asset suspiciously small (${bytes.byteLength} bytes)`);
    if (!/(javascript|ecmascript|css|octet-stream)/i.test(contentType)) problems.push(`unexpected asset content-type ${contentType || "(missing)"}`);
    const result = { path: url.pathname, status: response.status, elapsedMs: Math.round(performance.now() - started), bytes: bytes.byteLength, contentType, problems };
    results.push(result);
    if (problems.length) failures.push(result);
  } catch (error) {
    const result = { path: url.pathname, elapsedMs: Math.round(performance.now() - started), problems: [error instanceof Error ? error.message : String(error)] };
    results.push(result);
    failures.push(result);
  }
}

for (const route of routes) await check(route.path, route.kind);

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), origin, results, failures }, null, 2));
if (failures.length) process.exitCode = 1;
