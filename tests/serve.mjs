import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

createServer((request, response) => {
  const path = decodeURIComponent(
    new URL(request.url, "http://localhost").pathname,
  );
  const relativePath = path.endsWith("/") ? `${path}index.html` : path;
  const target = normalize(join(root, relativePath));
  if (!target.startsWith(root) || !existsSync(target)) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": types[extname(target)] || "application/octet-stream",
  });
  createReadStream(target).pipe(response);
}).listen(4173, "127.0.0.1");
