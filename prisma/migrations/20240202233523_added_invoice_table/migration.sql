-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
