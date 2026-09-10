"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ExperimentName =
  | "checkout_flow"
  | "product_card_layout"
  | "hero_variant"
  | "search_results";

type VariantName = "control" | "variant";

interface Experiment {
  name: ExperimentName;
  variant: VariantName;
}

interface FeatureFlagsContextValue {
  getVariant: (experiment: ExperimentName) => VariantName;
  isEnabled: (flag: string) => boolean;
  experiments: Experiment[];
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

const DEFAULT_EXPERIMENTS: Record<ExperimentName, VariantName> = {
  checkout_flow: "control",
  product_card_layout: "control",
  hero_variant: "control",
  search_results: "control",
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  useEffect(() => {
    const userId = "anonymous";
    const assigned = Object.entries(DEFAULT_EXPERIMENTS).map(([name, defaultVariant]) => {
      const isVariant = hashString(`${userId}:${name}`) % 2 === 0;
      return { name, variant: isVariant ? "variant" : "control" } as Experiment;
    });
    setExperiments(assigned);
  }, []);

  const value = useMemo(() => {
    const getVariant = (experiment: ExperimentName): VariantName => {
      return experiments.find((item) => item.name === experiment)?.variant || "control";
    };

    const isEnabled = (flag: string): boolean => {
      if (typeof window === "undefined") return false;
      return window.__FEATURE_FLAGS__?.[flag] === true || false;
    };

    return { getVariant, isEnabled, experiments };
  }, [experiments]);

  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }
  return context;
}

declare global {
  interface Window {
    __FEATURE_FLAGS__?: Record<string, boolean>;
  }
}
