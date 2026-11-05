import type { MetadataRoute } from "next";
import { CANONICAL_URL } from "@/lib/brand";

// Everything public is open to search engines and AI assistants; couples' invitations, the studio and the API are not.
const PRIVATE = ["/api/", "/i/", "/studio", "/admin", "/preview", "/redeem"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // named so it is clear they are welcome: answers in ChatGPT, Claude, Perplexity, Gemini and Copilot come from these
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot"], allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${CANONICAL_URL}/sitemap.xml`,
    host: CANONICAL_URL,
  };
}
