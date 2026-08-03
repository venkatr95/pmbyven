import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type OptimizedImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  fallbackClassName?: string;
};

/**
 * next/image wrapper with remote/local support, lazy loading, and a graceful fallback.
 * Prefer this over raw <img> for Core Web Vitals (LCP, CLS).
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallbackClassName,
  fill,
  sizes,
  priority,
  ...rest
}: OptimizedImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-[hsl(var(--gradient-from)/0.3)] to-[hsl(var(--gradient-to)/0.3)]",
          fill && "absolute inset-0",
          fallbackClassName || className
        )}
        aria-hidden
      />
    );
  }

  // next/image requires absolute URLs for remote hosts, or public-relative paths
  const isRemote = src.startsWith("http://") || src.startsWith("https://");
  const isData = src.startsWith("data:");

  if (isData) {
    // data URLs (e.g. share canvas preview) — native img
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        className={cn("object-cover", className)}
        priority={priority}
        unoptimized={!isRemote && src.startsWith("/uploads")}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized={!isRemote && src.startsWith("/uploads")}
      {...rest}
    />
  );
}
