-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('likes', 'wantsToWatch', 'recommends');

-- CreateTable
CREATE TABLE "conferences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "conferenceId" TEXT NOT NULL,

    CONSTRAINT "talks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talk_speakers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "avatar" TEXT,
    "talkId" TEXT NOT NULL,

    CONSTRAINT "talk_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "photoUrl" TEXT,
    "createdAt" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talk_reactions" (
    "id" TEXT NOT NULL,
    "talkId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talk_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talk_reviews" (
    "id" TEXT NOT NULL,
    "talkId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "talk_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conferences_name_key" ON "conferences"("name");

-- CreateIndex
CREATE UNIQUE INDEX "talks_title_conferenceId_key" ON "talks"("title", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "talk_reactions_talkId_userId_type_key" ON "talk_reactions"("talkId", "userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "talk_reviews_talkId_userId_key" ON "talk_reviews"("talkId", "userId");

-- AddForeignKey
ALTER TABLE "talks" ADD CONSTRAINT "talks_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "conferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_speakers" ADD CONSTRAINT "talk_speakers_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "talks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_reactions" ADD CONSTRAINT "talk_reactions_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "talks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_reactions" ADD CONSTRAINT "talk_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_reviews" ADD CONSTRAINT "talk_reviews_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "talks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_reviews" ADD CONSTRAINT "talk_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
