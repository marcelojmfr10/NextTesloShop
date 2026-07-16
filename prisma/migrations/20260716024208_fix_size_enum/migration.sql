-- RenameEnumValue
ALTER TYPE "Size" RENAME VALUE 'SizeM' TO 'M';

-- AlterEnum
ALTER TYPE "Size" ADD VALUE 'S' BEFORE 'M';
