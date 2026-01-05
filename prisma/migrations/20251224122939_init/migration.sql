-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('likes', 'wantsToWatch');

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
    "likes" INTEGER NOT NULL DEFAULT 0,
    "wantsToWatch" INTEGER NOT NULL DEFAULT 0,
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
    "id" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talk_reactions" (
    "id" TEXT NOT NULL,
    "talkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talk_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conferences_name_key" ON "conferences"("name");

-- CreateIndex
CREATE UNIQUE INDEX "talks_title_conferenceId_key" ON "talks"("title", "conferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "talk_reactions_talkId_userId_type_key" ON "talk_reactions"("talkId", "userId", "type");

-- AddForeignKey
ALTER TABLE "talks" ADD CONSTRAINT "talks_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "conferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_speakers" ADD CONSTRAINT "talk_speakers_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "talks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_reactions" ADD CONSTRAINT "talk_reactions_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "talks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talk_reactions" ADD CONSTRAINT "talk_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
