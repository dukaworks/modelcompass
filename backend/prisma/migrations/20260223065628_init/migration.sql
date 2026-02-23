-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "capabilities" TEXT[],
    "contextLength" INTEGER NOT NULL,
    "maxTokens" INTEGER,
    "promptPrice" DOUBLE PRECISION NOT NULL,
    "completionPrice" DOUBLE PRECISION NOT NULL,
    "tags" TEXT[],
    "recommendedFor" TEXT[],
    "codingScore" INTEGER DEFAULT 0,
    "reasoningScore" INTEGER DEFAULT 0,
    "writingScore" INTEGER DEFAULT 0,
    "chineseScore" INTEGER DEFAULT 0,
    "speedScore" INTEGER DEFAULT 0,
    "websiteUrl" TEXT,
    "docsUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "ratingAvg" DOUBLE PRECISION DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubmission" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "latencyMs" INTEGER,
    "costPer1k" DOUBLE PRECISION,
    "userEmail" TEXT,
    "userName" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsage" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "costUsd" DOUBLE PRECISION NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeartbeatLog" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeartbeatLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkScore" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "mmlu" DOUBLE PRECISION,
    "humaneval" DOUBLE PRECISION,
    "gsm8k" DOUBLE PRECISION,
    "hellaswag" DOUBLE PRECISION,
    "source" TEXT NOT NULL,
    "url" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BenchmarkScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMetric" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "twitterMentions" INTEGER NOT NULL DEFAULT 0,
    "redditScore" INTEGER NOT NULL DEFAULT 0,
    "githubStars" INTEGER NOT NULL DEFAULT 0,
    "sentiment" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_modelId_key" ON "Model"("modelId");

-- CreateIndex
CREATE INDEX "HeartbeatLog_taskName_idx" ON "HeartbeatLog"("taskName");

-- CreateIndex
CREATE INDEX "HeartbeatLog_status_idx" ON "HeartbeatLog"("status");

-- CreateIndex
CREATE INDEX "HeartbeatLog_timestamp_idx" ON "HeartbeatLog"("timestamp");

-- CreateIndex
CREATE INDEX "BenchmarkScore_modelId_idx" ON "BenchmarkScore"("modelId");

-- CreateIndex
CREATE INDEX "BenchmarkScore_timestamp_idx" ON "BenchmarkScore"("timestamp");

-- CreateIndex
CREATE INDEX "SocialMetric_modelId_idx" ON "SocialMetric"("modelId");

-- CreateIndex
CREATE INDEX "SocialMetric_timestamp_idx" ON "SocialMetric"("timestamp");
