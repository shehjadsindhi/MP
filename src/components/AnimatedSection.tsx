"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

type AnimationVariant = "fadeIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "stagger";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  staggerChildren?: number;
  as?: "section" | "div" | "article";
}

const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedSection({
  children,
  className = "",
  variant = "fadeInUp",
  delay = 0,
  duration = 0.7,
  threshold = 0.15,
  once = true,
  staggerChildren = 0.1,
  as = "section",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const springConfig = { stiffness: 100, damping: 20, mass: 0.8 };
  const smoothDelay = useSpring(delay, springConfig);

  const isStagger = variant === "stagger";

  const motionVariants = isStagger ? containerVariants : variants[variant];

  const Component = motion[as === "article" ? "article" : as === "div" ? "div" : "section"];

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={motionVariants}
      transition={{
        duration,
        delay: delay || (isStagger ? 0 : smoothDelay.get()),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {isStagger ? (
        <div style={{ display: "contents" }}>
          {Array.isArray(children)
            ? children.map((child, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{
                    duration: 0.5,
                    delay: index * staggerChildren,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {child}
                </motion.div>
              ))
            : children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}

export { itemVariants, containerVariants };
