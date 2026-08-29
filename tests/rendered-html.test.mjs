import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readHomepageHtml() {
  const url = new URL("../.next/server/app/index.html", import.meta.url);
  return readFile(url, "utf8");
}

test("server-renders the WESTERN storefront", async () => {
  const html = await readHomepageHtml();

  assert.match(html, /<title>WESTERN — Built for the City<\/title>/);
  assert.match(html, /WESTERN/);
  assert.doesNotMatch(html, /codex-preview|_sites-preview|react-loading-skeleton/);
});
