import { httpServer } from "./src/http_server/index.js";

const HTTP_PORT = 8181;

console.log(`Start static http server on http://localhost:${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);
