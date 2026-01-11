import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { requireOrgFromSlug } from "../../../../lib/org";

export const Route = createFileRoute("/api/$orgSlug/requests/replay")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const orgResult = await requireOrgFromSlug(request, params.orgSlug);
          if ("error" in orgResult) return orgResult.error;

          const body = await request.json();
          const { url, method, headers, requestBody } = body;

          if (!url || !method) {
            return json(
              { error: "url and method are required" },
              { status: 400 }
            );
          }

          const startTime = Date.now();

          // Make the actual request
          const response = await fetch(url, {
            method,
            headers: headers || {},
            body: ["GET", "HEAD"].includes(method) ? undefined : requestBody,
          });

          const duration = Date.now() - startTime;

          // Get response headers
          const responseHeaders: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          // Get response body
          let responseBody: string | null = null;
          try {
            responseBody = await response.text();
          } catch {
            responseBody = null;
          }

          return json({
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: responseBody,
            duration,
          });
        } catch (error) {
          console.error("Error replaying request:", error);
          return json(
            { 
              error: error instanceof Error ? error.message : "Failed to replay request" 
            },
            { status: 500 }
          );
        }
      },
    },
  },
});