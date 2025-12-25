import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { auth } from "../../../lib/auth";
import { redis } from "../../../lib/redis";
import { db } from "../../../db";
import { subscriptions } from "../../../db/subscription-schema";
import { SUBSCRIPTION_PLANS } from "../../../lib/subscription-plans";
import { getBandwidthKey } from "../../../../../../shared/utils";

export const Route = createFileRoute("/api/stats/bandwidth")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const organizationId = url.searchParams.get("organizationId");

        if (!organizationId) {
          return json({ error: "Organization ID required" }, { status: 400 });
        }

        const organizations = await auth.api.listOrganizations({
          headers: request.headers,
        });

        const hasAccess = organizations.find(
          (org) => org.id === organizationId,
        );

        if (!hasAccess) {
          return json({ error: "Unauthorized" }, { status: 403 });
        }

        const key = getBandwidthKey(organizationId);
        const usageStr = await redis.get(key);
        const usage = parseInt(usageStr || "0", 10);

        const subscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.organizationId, organizationId))
          .limit(1);

        const planId = subscription[0]?.plan || "free";
        const plan =
          SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
        const limit = plan.features.bandwidthPerMonth;

        return json({
          usage,
          limit,
          percentage: Math.min((usage / limit) * 100, 100),
        });
      },
    },
  },
});
