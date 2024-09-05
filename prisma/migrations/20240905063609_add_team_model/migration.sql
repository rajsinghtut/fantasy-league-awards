/*
  Warnings:

  - Added the required column `teamName` to the `DraftEvaluation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DraftEvaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DraftEvaluation" ("comment", "createdAt", "grade", "id", "strengths", "teamId", "weaknesses") SELECT "comment", "createdAt", "grade", "id", "strengths", "teamId", "weaknesses" FROM "DraftEvaluation";
DROP TABLE "DraftEvaluation";
ALTER TABLE "new_DraftEvaluation" RENAME TO "DraftEvaluation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
