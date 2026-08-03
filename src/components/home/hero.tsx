"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { LogoMark } from "@/components/brand/logo";
import { formatDate, readingTimeLabel } from "@/lib/utils";
import type { PostCardData } from "@/components/posts/post-card";

export function Hero({ post }: { post: PostCardData | null }) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-28 pb-16">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="hero-blob w-[500px] h-[500px] -top-20 -left-20"
          style={{ background: "hsl(var(--hero-blob-1))" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hero-blob w-[400px] h-[400px] top-1/3 -right-20"
          style={{ background: "hsl(var(--hero-blob-2))" }}
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hero-blob w-[350px] h-[350px] bottom-0 left-1/3"
          style={{ background: "hsl(var(--hero-blob-3))" }}
          animate={{ x: [0, 25, 0], y: [0, -35, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {post ? (
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Badge>Featured</Badge>
                {post.category && (
                  <Badge variant="outline">{post.category.name}</Badge>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-2xl lg:text-4xl tracking-tight leading-[1.08] mb-6">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mb-8">
                  {post.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                {post.author && (
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-9 w-9 ring-2 ring-background">
                      <AvatarImage src={post.author.avatar || undefined} />
                      <AvatarFallback>
                        {post.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-base font-medium">{post.author.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </div>
                )}
                <span className="text-base text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTimeLabel(post.readingTime)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="cta">
                  <Link href={`/blog/${post.slug}`}>
                    Read article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="glass">
                  <Link href="/blog">Browse all</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-strong shadow-2xl">
                  {post.coverImage ? (
                    <OptimizedImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[hsl(var(--gradient-from)/0.4)] via-[hsl(var(--gradient-to)/0.25)] to-muted flex items-center justify-center text-foreground/25">
                      <LogoMark className="h-20 w-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </Link>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl tracking-tight mb-6">
              If Apple designed Medium
            </h1>
            <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">
              Premium editorial publishing with glass depth, beautiful type, and zero clutter.
            </p>
            <Button asChild size="lg" variant="cta">
              <Link href="/blog">
                Explore articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
