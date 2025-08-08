-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "koleksiyonu" TEXT NOT NULL,
    "olcusu" TEXT NOT NULL,
    "renk" TEXT NOT NULL,
    "finish" TEXT,
    "imagePath" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
