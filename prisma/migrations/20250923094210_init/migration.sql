-- CreateTable
CREATE TABLE "public"."talks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "speakerAvatar" TEXT,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "talks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "talks_title_speaker_key" ON "public"."talks"("title", "speaker");
