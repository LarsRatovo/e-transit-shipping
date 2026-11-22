CREATE TYPE "ShippingUnit" AS ENUM ('PIECE', 'CBM', 'KG');

CREATE TABLE "shipping_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "unit" "ShippingUnit" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "shipping_types_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "shipping_types_name_key" ON "shipping_types"("name");
