'use client'

import type { BlogPost } from '@/lib/blog-data'
import { blogPosts } from '@/lib/blog-data'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPostContentProps {
  post: BlogPost
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  // Find the next post for the "Continue Reading" section
  const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug)
  const nextPost = blogPosts[(currentIndex + 1) % blogPosts.length]

  return (
    <article>
      {/* Hero */}
      <div className="relative w-full aspect-[21/9] min-h-[320px] max-h-[640px] overflow-hidden">
        <Image
          src={post.heroImage}
          alt={post.heroAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-background/80" />
        {/* Category badge */}
        <div className="absolute top-8 left-8 lg:left-16">
          <span className="font-sans text-[10px] font-medium tracking-[0.3em] uppercase text-background border border-background/60 bg-foreground/30 backdrop-blur-sm px-3 py-1.5">
            {post.category}
          </span>
        </div>
      </div>

      {/* Article header */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Meta */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/blog"
              className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              &larr; Journal
            </Link>
            <span className="text-border">|</span>
            <span className="font-sans text-xs text-muted-foreground">{post.date}</span>
            <span className="text-border">|</span>
            <span className="font-sans text-xs text-muted-foreground">{post.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif font-light text-foreground leading-tight text-pretty mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            {post.title}
          </h1>
          <p className="font-serif italic text-xl text-muted-foreground leading-relaxed mb-10">
            {post.subtitle}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 py-6 border-y border-border">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-sm text-muted-foreground">PG</span>
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-foreground">Praveen Gupta</p>
              <p className="font-sans text-xs text-muted-foreground">Lead Photographer, Studio AYNSH</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Article body */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto px-6 lg:px-8 pb-20 space-y-6"
      >
        {post.content.map((section, i) => {
          if (section.type === 'paragraph') {
            return (
              <p key={i} className="font-sans text-base text-foreground/80 leading-relaxed">
                {section.text}
              </p>
            )
          }
          if (section.type === 'heading') {
            return (
              <h2 key={i} className="font-serif text-2xl lg:text-3xl font-light text-foreground leading-snug pt-6">
                {section.text}
              </h2>
            )
          }
          if (section.type === 'subheading') {
            return (
              <h3 key={i} className="font-serif text-xl font-light text-foreground pt-4">
                {section.text}
              </h3>
            )
          }
          if (section.type === 'quote') {
            return (
              <blockquote key={i} className="relative border-l-2 border-accent pl-8 py-4 my-8">
                <p className="font-serif text-xl lg:text-2xl italic font-light text-foreground leading-relaxed">
                  &ldquo;{section.text}&rdquo;
                </p>
              </blockquote>
            )
          }
          if (section.type === 'list' && section.items) {
            return (
              <ul key={i} className="space-y-3 pl-4">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                    <span className="font-sans text-sm text-foreground/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )
          }
          return null
        })}
      </motion.div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="border-t border-border" />
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 text-center">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
          Ready to work together?
        </p>
        <h3 className="font-serif text-3xl font-light text-foreground mb-6">
          Book Your Session
        </h3>
        <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
          Every great photograph begins with a conversation. Reach out and let us craft something extraordinary together.
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center justify-center px-8 py-3.5 border border-foreground text-foreground font-sans text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-all duration-300"
        >
          Reserve Your Date
        </Link>
      </div>

      {/* Continue Reading */}
      {nextPost && (
        <div className="bg-muted border-t border-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">
              Continue Reading
            </p>
            <Link href={`/blog/${nextPost.slug}`} className="group flex items-center gap-8">
              <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden">
                <Image
                  src={nextPost.heroImage}
                  alt={nextPost.heroAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-sans text-[10px] font-medium tracking-[0.2em] uppercase text-accent mb-2 block">
                  {nextPost.category}
                </span>
                <h4 className="font-serif text-xl font-light text-foreground group-hover:text-accent transition-colors duration-300 truncate">
                  {nextPost.title}
                </h4>
              </div>
              <span className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground group-hover:text-accent transition-colors duration-300 flex-shrink-0">
                Read &rarr;
              </span>
            </Link>
          </div>
        </div>
      )}
    </article>
  )
}
