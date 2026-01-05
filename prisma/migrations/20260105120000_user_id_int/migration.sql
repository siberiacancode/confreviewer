-- Change user identifiers from text to integer and keep relations intact.
ALTER TABLE "talk_reactions" DROP CONSTRAINT "talk_reactions_userId_fkey";

ALTER TABLE "users"
  ALTER COLUMN "id" TYPE INTEGER USING "id"::integer;

ALTER TABLE "talk_reactions"
  ALTER COLUMN "userId" TYPE INTEGER USING "userId"::integer;

ALTER TABLE "talk_reactions"
  ADD CONSTRAINT "talk_reactions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

