import { motion, useScroll, useSpring } from 'motion/react'
import { CtaPhone } from './components/CtaPhone'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Nav } from './components/Nav'
import { Pricing } from './components/Pricing'
import { Testimonials } from './components/Testimonials'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-green-500"
    />
  )
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CtaPhone />
      </main>
      <Footer />
    </>
  )
}
