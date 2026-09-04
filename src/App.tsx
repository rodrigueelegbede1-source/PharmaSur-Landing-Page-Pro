import { motion, useScroll, useSpring } from 'motion/react'
import { CtaPhone } from './components/CtaPhone'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Nav } from './components/Nav'
import { Pricing } from './components/Pricing'
import { Reliability } from './components/Reliability'
import { Souscription } from './components/Souscription'
import { Testimonials } from './components/Testimonials'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-green-400"
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
        <Reliability />
        <Pricing />
        <Souscription />
        <Testimonials />
        <CtaPhone />
      </main>
      <Footer />
    </>
  )
}
