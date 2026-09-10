"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  fill = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (src.startsWith("/")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-800/40 animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
