-- AlterEnum: Add 'recommends' value to ReactionType enum
ALTER TYPE "ReactionType" ADD VALUE IF NOT EXISTS 'recommends';

-- Update existing records from 'recommended' to 'recommends' if they exist
-- This handles the case where old data might have used 'recommended'
-- Note: This will only work if 'recommended' was previously a valid enum value
-- If the enum never had 'recommended', this UPDATE will be a no-op
DO $$
BEGIN
  -- Check if 'recommended' exists in the enum and update records
  IF EXISTS (
    SELECT 1 
    FROM pg_enum 
    WHERE enumlabel = 'recommended' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ReactionType')
  ) THEN
    -- Update all records with 'recommended' to 'recommends'
    UPDATE "talk_reactions" 
    SET "type" = 'recommends'::"ReactionType"
    WHERE "type"::text = 'recommended';
  END IF;
END $$;

