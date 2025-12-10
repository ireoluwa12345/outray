import { IncomingMessage, ServerResponse } from "http";
import { TunnelRouter } from "./TunnelRouter";
import { extractSubdomain } from "../../../shared/utils";

export class HTTPProxy {
  private router: TunnelRouter;
  private baseDomain: string;

  constructor(router: TunnelRouter, baseDomain: string) {
    this.router = router;
    this.baseDomain = baseDomain;
  }

  async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    const host = req.headers.host || "";
    const tunnelId = extractSubdomain(host, this.baseDomain);

    if (!tunnelId) {
      res.writeHead(404);
      res.end("Tunnel not found");
      return;
    }

    try {
      const headers: Record<string, string | string[]> = {};
      Object.entries(req.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          headers[key] = value;
        }
      });

      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }

      const response = await this.router.forwardRequest(
        tunnelId,
        req.method || "GET",
        req.url || "/",
        headers,
        body || undefined,
      );

      res.writeHead(response.statusCode, response.headers);
      res.end(response.body || "");
    } catch (error) {
      console.error("Proxy error:", error);
      res.writeHead(502);
      res.end("Bad Gateway");
    }
  }
}
