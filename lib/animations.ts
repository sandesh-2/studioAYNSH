/**
 * Premium Animation Utilities for Studio AYNSH
 * Sophisticated 3D/4D animations aligned with luxury photography aesthetic
 */

export const animationVariants = {
  // Elegant entrance animations
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // 3D rotation entrance (subtle)
  rotateIn: {
    initial: { opacity: 0, rotateX: -20, rotateY: -20 },
    animate: { opacity: 1, rotateX: 0, rotateY: 0 },
    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Scale with spring physics for premium feel
  scaleInSpring: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },

  // Stagger container for sequential item animations
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },

  // Text reveal animations
  textReveal: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },

  // Blur in effect (premium photography style)
  blurIn: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 1, ease: 'easeOut' },
  },

  // Perspective transform for depth
  perspectiveIn: {
    initial: {
      opacity: 0,
      y: 40,
      rotateX: 15,
      perspective: 1000,
    },
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      perspective: 1000,
    },
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Subtle shimmer effect (premium feel)
  shimmer: {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },

  // Float animation for subtle vertical movement
  float: {
    initial: { y: 0 },
    animate: { y: [-8, 8, -8] },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Elegant hover scale
  hoverScale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Image zoom effect (photography focus)
  imageZoom: {
    initial: { scale: 1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.08 },
    transition: {
      scale: { duration: 0.5, ease: 'easeOut' },
      opacity: { duration: 0.4 },
    },
  },

  // Text line animation
  lineReveal: {
    initial: { width: 0 },
    animate: { width: '100%' },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Circular reveal (premium luxury aesthetic)
  circleReveal: {
    initial: {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
    },
    animate: {
      clipPath: 'circle(100% at 50% 50%)',
      opacity: 1,
    },
    transition: { duration: 0.9, ease: 'easeOut' },
  },

  // Diagonal slide entrance
  diagonalSlide: {
    initial: { opacity: 0, x: 60, y: -60 },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Staggered text reveal for headings
  wordReveal: {
    container: {
      initial: { opacity: 1 },
      animate: {
        transition: {
          staggerChildren: 0.08,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    },
  },

  // Elegant fade with slight lift
  fadeInLift: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Button press animation
  buttonPress: {
    whileHover: { y: -3 },
    whileTap: { y: 0 },
    transition: { duration: 0.2 },
  },

  // Carousel slide animation
  carouselSlide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.5, ease: 'easeInOut' },
  },

  // 3D flip card
  flipCard: {
    initial: { rotateY: 0 },
    whileHover: { rotateY: 180 },
    transition: { duration: 0.6 },
  },

  // Sophisticated fade with scale combo
  fadeScaleUp: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  // Premium portfolio image reveal
  portfolioReveal: {
    initial: {
      opacity: 0,
      scale: 0.9,
      rotateY: -15,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },

  // Elegant underline animation
  underlineReveal: {
    initial: { width: 0, x: 0 },
    whileHover: { width: '100%' },
    transition: { duration: 0.3 },
  },

  // Text gradient animation (premium look)
  textGradient: {
    initial: {
      backgroundPosition: '0% 50%',
    },
    animate: {
      backgroundPosition: '100% 50%',
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },

  // Gentle pulsing effect
  pulse: {
    initial: { opacity: 1 },
    animate: { opacity: [1, 0.8, 1] },
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },

  // Sophisticated entrance with opacity and perspective
  sophisticatedEntrance: {
    initial: {
      opacity: 0,
      y: 40,
      rotateX: 10,
      perspective: 1000,
    },
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
    },
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },

  // Service card entrance
  serviceCardEntrance: {
    initial: {
      opacity: 0,
      y: 30,
    },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    whileHover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(34, 34, 34, 0.1)',
    },
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },

  // Navigation link animation
  navLinkHover: {
    whileHover: { x: 4 },
    transition: { duration: 0.2 },
  },

  // CTA button animation
  ctaButtonHover: {
    whileHover: {
      scale: 1.02,
      boxShadow: '0 10px 25px rgba(34, 34, 34, 0.15)',
    },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },
}

// Predefined transition curves for consistency
export const easeConfigs = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  snappy: [0.34, 1.56, 0.64, 1],
  elegant: [0.4, 0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
}

// Scroll-triggered animation helper
export const scrollAnimationConfig = {
  margin: '-80px',
  once: true,
}

// Container animations for grouped elements
export const containerAnimations = {
  stagger: 0.1,
  delayChildren: 0.2,
}
