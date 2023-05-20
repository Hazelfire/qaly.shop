-- CreateTable
CREATE TABLE "Charity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,

    CONSTRAINT "Charity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftCard" (
    "id" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "purchaserName" TEXT NOT NULL,
    "purchaserEmail" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "stripeChargeId" TEXT NOT NULL,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("id")
);
