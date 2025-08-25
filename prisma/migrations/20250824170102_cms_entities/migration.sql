-- CreateEnum
CREATE TYPE "BannerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BannerPosition" AS ENUM ('HERO', 'SECONDARY', 'FOOTER');

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT,
    "buttonText" TEXT,
    "status" "BannerStatus" NOT NULL DEFAULT 'ACTIVE',
    "position" "BannerPosition" NOT NULL DEFAULT 'HERO',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedProduct" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "FeaturedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionMeta" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedProduct_position_key" ON "FeaturedProduct"("position");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionMeta_name_key" ON "CollectionMeta"("name");

-- AddForeignKey
ALTER TABLE "FeaturedProduct" ADD CONSTRAINT "FeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
