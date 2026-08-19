import React from "react";
import { prisma } from "@/lib/prisma";
import OffersClient from "./OffersClient";

export const metadata = {
  title: "Promotions & Exclusive Deals — Galaxy AI Hub",
  description: "Browse current Galaxy AI flagship discount coupons, student offers, trade-in credit estimators, and wearable bundles.",
};

export default async function OffersPage() {
  const offers = await prisma.offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return <OffersClient offers={offers} />;
}
