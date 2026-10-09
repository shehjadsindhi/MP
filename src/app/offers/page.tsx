import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { safeGetOffers } from "@/lib/db";
import OffersClient from "./OffersClient";

export const metadata = {
  title: "Promotions & Exclusive Deals — Galaxy AI Hub",
  description: "Browse current Galaxy AI flagship discount coupons, student offers, trade-in credit estimators, and wearable bundles.",
};

export default async function OffersPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const offers = await safeGetOffers();

  return <OffersClient offers={offers} />;
}
