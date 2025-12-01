"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { PhoneMockup } from "../../components/landing/PhoneMockup";
import { ArrowRight, Library, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function IntroPage() {
  return (
    <main className="bg-[#000000] text-white min-h-screen w-full overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      <HeroSection />
      <FeatureScrollSection />
      <PhoneRevealSection />
      <ParallaxTextSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-50" />
      
      <motion.div 
        style={{ y: y1, opacity }} 
        className="z-10 text-center px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
        >
          Stacks
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-xl md:text-2xl text-gray-400 max-w-lg mx-auto font-light"
        >
          Your reading life, <span className="text-white font-medium">elevated</span>.
        </motion.p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>
    </section>
  );
}

function FeatureScrollSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-55%"]);

  const cards = [
    { title: "Discover", subtitle: "Find your next favorite", image: "/images/bookstacks.jpg", icon: Sparkles },
    { title: "Track", subtitle: "Keep your progress", image: "/images/bookstacks2.jpg", icon: Library },
    { title: "Connect", subtitle: "Join the community", image: "/images/bookstacks3.jpg", icon: Zap },
    { title: "Curate", subtitle: "Build your shelf", image: "/images/bookstacks4.jpg", icon: Library },
    { title: "Share", subtitle: "Inspire others", image: "/images/bookstacks5.jpg", icon: Sparkles },
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8 px-8 md:px-24">
          {cards.map((card, i) => (
            <div key={i} className="group relative h-[400px] w-[300px] md:h-[600px] md:w-[450px] overflow-hidden rounded-3xl bg-gray-900/50 border border-white/10 backdrop-blur-sm transition-colors hover:bg-gray-900/80">
              <div className="absolute inset-0 z-0">
                 {/* Using a dark overlay on images for text readability */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                 <Image 
                   src={card.image} 
                   alt={card.title} 
                   fill
                   className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" 
                 />
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <card.icon className="w-8 h-8 mb-4 text-white/80" />
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight">{card.title}</h3>
                <p className="mt-2 text-lg text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PhoneRevealSection() {
  return (
    <section className="py-32 md:py-64 bg-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, margin: "-20%" }}
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
                Design that <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  disappears.
                </span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed max-w-md">
                The interface is crafted to fade away, leaving you alone with your thoughts and your books. Experience reading tracking that feels natural, not administrative.
              </p>
              
              <div className="mt-12 grid gap-8">
                {[
                  "Smart Recommendations",
                  "Beautiful Analytics",
                  "Private & Secure"
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <div className="h-[1px] w-8 bg-gray-600" />
                    <span className="text-lg text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center perspective-1000">
            <motion.div
              initial={{ opacity: 0, y: 100, rotateY: 15, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: -5, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, duration: 1 }}
              viewport={{ once: false, margin: "-10%" }}
            >
              <PhoneMockup className="shadow-2xl shadow-indigo-900/20">
                <div className="w-full h-full bg-gray-900 flex flex-col relative overflow-hidden">
                  {/* Mockup Content */}
                  <div className="h-full w-full absolute inset-0">
                    <Image 
                      src="/images/bookstacks7_blues.jpg" 
                      alt="App Screen" 
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  </div>
                  <div className="relative z-10 mt-auto p-6">
                     <div className="h-2 w-12 bg-white/20 rounded-full mb-4" />
                     <div className="h-6 w-3/4 bg-white/90 rounded-lg mb-2" />
                     <div className="h-4 w-1/2 bg-white/50 rounded-lg" />
                  </div>
                </div>
              </PhoneMockup>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ParallaxTextSection() {
  const { scrollYProgress } = useScroll();
  const x1 = useTransform(scrollYProgress, [0.5, 1], ["0%", "-20%"]);
  const x2 = useTransform(scrollYProgress, [0.5, 1], ["0%", "20%"]);

  return (
    <section className="py-32 overflow-hidden relative bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900/50 pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-4 opacity-20 select-none">
        <motion.div style={{ x: x1 }} className="text-[10vw] md:text-[12vw] font-bold whitespace-nowrap leading-none text-white/10">
          READING REIMAGINED
        </motion.div>
        <motion.div style={{ x: x2 }} className="text-[10vw] md:text-[12vw] font-bold whitespace-nowrap leading-none text-white/5 ml-[-20vw]">
          STACKS APP
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="h-screen flex flex-col items-center justify-center bg-black text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
          Ready to dive in?
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
          Join the community of readers who have elevated their reading experience with Stacks.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/home">
            <button className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-medium overflow-hidden transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Launch App <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>
          </Link>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 text-gray-600 text-sm">
        © 2025 Stacks. All rights reserved.
      </footer>
    </section>
  );
}

