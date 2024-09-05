-- CreateTable
CREATE TABLE "BeltHolder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "weekAcquired" INTEGER NOT NULL,
    "currentStreak" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "LongestStreak" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "streak" INTEGER NOT NULL
);
