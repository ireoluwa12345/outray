import http from "http";

export interface ForwardedResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body: string;
}

export class LocalForwarder {
  private localPort: number;

  constructor(localPort: number) {
    this.localPort = localPort;
  }

  async forward(
    method: string,
    path: string,
    headers: Record<string, string | string[]>,
    body?: string,
  ): Promise<ForwardedResponse> {
    return new Promise((resolve, reject) => {
      const options: http.RequestOptions = {
        hostname: "localhost",
        port: this.localPort,
        path,
        method,
        headers,
      };

      const req = http.request(options, (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          const responseHeaders: Record<string, string | string[]> = {};
          Object.entries(res.headers).forEach(([key, value]) => {
            if (value !== undefined) {
              responseHeaders[key] = value;
            }
          });

          resolve({
            statusCode: res.statusCode || 200,
            headers: responseHeaders,
            body: responseBody,
          });
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }
}
