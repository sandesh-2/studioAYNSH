'use client'

import { blogPosts } from '@/lib/blog-data'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export function BlogGrid() {
  const [featured, ...rest] = blogPosts

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Perspectives & Craft
        </p>
        <h1
          className="font-serif font-light text-foreground leading-tight text-pretty"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          The Studio
          <br />
          <em>Journal</em>
        </h1>
        <div className="w-10 h-px bg-accent mt-8" />
      </div>

      {/* Featured post */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-16"
      >
        <Link href={`/blog/${featured.slug}`} className="group block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border overflow-hidden">
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
              <Image
                src={featured.heroImage}
                alt={featured.heroAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/0 transition-colors duration-500" />
            </div>
            {/* Content */}
            <div className="flex flex-col justify-center p-10 lg:p-14 bg-card">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-accent border border-accent/30 px-3 py-1">
                  {featured.category}
                </span>
                <span className="font-sans text-xs text-muted-foreground">
                  {featured.readTime}
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-light text-foreground leading-snug text-pretty mb-4 group-hover:text-accent transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs text-muted-foreground/70">{featured.date}</span>
                <span className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground group-hover:text-accent transition-colors duration-300">
                  Read Article &rarr;
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Grid of remaining posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {rest.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 + 0.2 }}
          >
            <Link href={`/blog/${post.slug}`} className="group block border border-border overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.heroAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/0 transition-colors duration-500" />
              </div>
              {/* Content */}
              <div className="p-7 bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-accent border border-accent/30 px-2.5 py-1">
                    {post.category}
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="font-serif text-2xl font-light text-foreground leading-snug text-pretty mb-3 group-hover:text-accent transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-5">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-sans text-xs text-muted-foreground/70">{post.date}</span>
                  <span className="font-sans text-xs font-medium tracking-[0.12em] uppercase text-foreground group-hover:text-accent transition-colors duration-300">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
