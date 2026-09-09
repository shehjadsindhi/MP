"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ParallaxHeroBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function ParallaxHeroBackground({
  children,
  className = "",
  intensity = 15,
}: ParallaxHeroBackgroundProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const bgX = useTransform(smoothX, [-1, 1], [-intensity, intensity]);
  const bgY = useTransform(smoothY, [-1, 1], [-intensity, intensity]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className={className}
      style={{
        x: bgX,
        y: bgY,
      }}
    >
      {children}
    </motion.div>
  );
}
