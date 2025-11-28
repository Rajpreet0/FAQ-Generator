-- Migration: Add API Key fields to UserSettings
-- This migration adds API key management fields for the public API

-- Add new columns to user_settings table
ALTER TABLE "user_settings"
ADD COLUMN IF NOT EXISTS "api_key" TEXT,
ADD COLUMN IF NOT EXISTS "api_key_created_at" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "api_key_expires_at" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "api_request_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "api_last_request" TIMESTAMP(3);

-- Add comment to document the purpose
COMMENT ON COLUMN "user_settings"."api_key" IS 'User API key for public API access';
COMMENT ON COLUMN "user_settings"."api_key_created_at" IS 'When the API key was generated';
COMMENT ON COLUMN "user_settings"."api_key_expires_at" IS 'API key expiration date (30 days from creation)';
COMMENT ON COLUMN "user_settings"."api_request_count" IS 'Request count for current hour (rate limiting)';
COMMENT ON COLUMN "user_settings"."api_last_request" IS 'Last API request timestamp for rate limiting';
