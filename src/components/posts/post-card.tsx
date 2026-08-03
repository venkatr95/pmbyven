"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";
import { cn, formatDate, formatNumber, readingTimeLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptimizedImage } from "@/components/ui/optimized-image";

export interface PostCardData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  readingTime: number;
  views: number;
  publishedAt?: Date | string | null;
  featured?: boolean;
  editorsPick?: boolean;
  author?: {
    name: string;
    slug: string;
    avatar?: string | null;
  } | null;
  category?: {
    name: string;
    slug: string;
  } | null;
}

export function PostCard({
  post,
  variant = "default",
  index = 0,
}: {
  post: PostCardData;
  variant?: "default" | "featured" | "compact" | "horizontal";
  index?: number;
}) {
  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-3 items-start">
        <span className="text-2xl font-serif text-muted-foreground/40 w-8 shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h4 className="text-base font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(post.views)}
            </span>
            <span>·</span>
            <span>{readingTimeLabel(post.readingTime)}</span>
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="group flex flex-col sm:flex-row gap-5 glass rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="relative sm:w-48 h-36 sm:h-auto rounded-xl overflow-hidden bg-muted shrink-0 min-h-[9rem]">
            <OptimizedImage
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0 py-1">
            {post.category && (
              <Badge variant="secondary" className="w-fit mb-2">
                {post.category.name}
              </Badge>
            )}
            <h3 className="font-serif text-2xl leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-base text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-3 mt-3.5 text-sm text-muted-foreground">
              {post.author && <span>{post.author.name}</span>}
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTimeLabel(post.readingTime)}
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className={cn(variant === "featured" && "md:col-span-2")}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block h-full glass rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            variant === "featured" ? "aspect-[21/9] md:aspect-[2.4/1]" : "aspect-[16/10]"
          )}
        >
          <OptimizedImage
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={
              variant === "featured"
                ? "(max-width: 768px) 100vw, 1200px"
                : "(max-width: 768px) 100vw, 400px"
            }
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            fallbackClassName="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gradient-from)/0.35)] via-[hsl(var(--gradient-to)/0.2)] to-muted"
          />
          {(post.featured || post.editorsPick) && (
            <div className="absolute top-3 left-3 flex gap-2">
              {post.featured && <Badge>Featured</Badge>}
              {post.editorsPick && <Badge variant="secondary">Editor&apos;s Pick</Badge>}
            </div>
          )}
        </div>
        <div className={cn("p-5 sm:p-6", variant === "featured" && "sm:p-8")}>
          {post.category && (
            <Badge variant="outline" className="mb-3">
              {post.category.name}
            </Badge>
          )}
          <h3
            className={cn(
              "font-serif leading-snug group-hover:text-primary transition-colors",
              variant === "featured" ? "text-3xl sm:text-4xl" : "text-2xl"
            )}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className={cn(
                "text-muted-foreground mt-3 leading-relaxed",
                variant === "featured" ? "text-lg line-clamp-3" : "text-base line-clamp-2"
              )}
            >
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2.5">
              {post.author && (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {post.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{post.author.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTimeLabel(post.readingTime)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
