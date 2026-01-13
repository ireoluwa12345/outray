import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { redis } from "../../../lib/redis";

const TOKEN_PREFIX = "dashboard:ws:";

export const Route = createFileRoute("/api/dashboard/validate-ws-token")({
  server: {
    handlers: {
      // Validate a dashboard WebSocket token (called by tunnel server)
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { token } = body;

          if (!token) {
            return json({ valid: false, error: "Token required" }, { status: 400 });
          }

          const key = `${TOKEN_PREFIX}${token}`;
          
          // Get and delete atomically (single-use token)
          const tokenData = await redis.getdel(key);

          if (!tokenData) {
            return json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
          }

          const { orgId, userId } = JSON.parse(tokenData);

          return json({
            valid: true,
            orgId,
            userId,
          });
        } catch (error) {
          console.error("Error validating dashboard token:", error);
          return json({ valid: false, error: "Internal server error" }, { status: 500 });
        }
      },
    },
  },
});
