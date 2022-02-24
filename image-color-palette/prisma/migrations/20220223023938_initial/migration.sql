-- CreateTable
CREATE TABLE "ColorPalette" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "colorHigh" TEXT NOT NULL,
    "colorMid" TEXT NOT NULL,
    "colorLow" TEXT NOT NULL,

    CONSTRAINT "ColorPalette_pkey" PRIMARY KEY ("id")
);
