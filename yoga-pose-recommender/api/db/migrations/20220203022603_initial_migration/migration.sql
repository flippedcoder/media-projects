-- CreateTable
CREATE TABLE "Pose" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "you_url" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Pose_pkey" PRIMARY KEY ("id")
);
