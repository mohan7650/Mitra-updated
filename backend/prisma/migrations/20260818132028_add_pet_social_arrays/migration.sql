-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "favorite_activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "favorite_treats" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "personality_traits" TEXT[] DEFAULT ARRAY[]::TEXT[];
