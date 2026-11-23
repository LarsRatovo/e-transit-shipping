CREATE TABLE "packages" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "shipping_type_id" UUID NOT NULL,
    "measure" DECIMAL(12,3) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "packages_client_id_idx" ON "packages"("client_id");
CREATE INDEX "packages_shipping_type_id_idx" ON "packages"("shipping_type_id");

ALTER TABLE "packages"
ADD CONSTRAINT "packages_shipping_type_id_fkey"
FOREIGN KEY ("shipping_type_id") REFERENCES "shipping_types"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
