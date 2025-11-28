import prisma from "@/lib/prisma";

/**
 * Rate Limiting Configuration
 */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_HOUR = 15;

/**
 * Check if API key is valid and within rate limits
 *
 * Rate limiting is enforced PER USER, not per API key.
 * This prevents users from bypassing rate limits by generating new keys.
 *
 * @param apiKey - The API key to validate
 * @returns Object with isValid flag and optional error message
 */
export async function checkRateLimit(apiKey: string): Promise<{
  isValid: boolean;
  error?: string;
  userId?: string;
}> {
  try {
    // Find user settings by API key
    const settings = await prisma.userSettings.findFirst({
      where: { apiKey },
    });

    if (!settings) {
      return { isValid: false, error: "Invalid API key" };
    }

    // Check if API key has expired
    if (settings.apiKeyExpiresAt && new Date() > settings.apiKeyExpiresAt) {
      return { isValid: false, error: "API key has expired" };
    }

    const now = new Date();
    const lastRequest = settings.apiLastRequest;

    // If no previous request or more than 1 hour has passed, reset counter
    if (
      !lastRequest ||
      now.getTime() - lastRequest.getTime() > RATE_LIMIT_WINDOW_MS
    ) {
      await prisma.userSettings.update({
        where: { userId: settings.userId },
        data: {
          apiRequestCount: 1,
          apiLastRequest: now,
        },
      });

      return { isValid: true, userId: settings.userId };
    }

    // Check if rate limit is exceeded (enforced per USER, not per API key)
    if (settings.apiRequestCount >= MAX_REQUESTS_PER_HOUR) {
      const timeUntilReset = Math.ceil(
        (RATE_LIMIT_WINDOW_MS -
          (now.getTime() - lastRequest.getTime())) /
          1000 /
          60
      );
      return {
        isValid: false,
        error: `Rate limit exceeded (${MAX_REQUESTS_PER_HOUR} requests/hour). Try again in ${timeUntilReset} minutes.`,
      };
    }

    // Increment request counter (per USER, so it persists across key regenerations)
    await prisma.userSettings.update({
      where: { userId: settings.userId },
      data: {
        apiRequestCount: settings.apiRequestCount + 1,
        apiLastRequest: now,
      },
    });

    return { isValid: true, userId: settings.userId };
  } catch (error) {
    console.error("Rate limit check error:", error);
    return { isValid: false, error: "Internal server error" };
  }
}
