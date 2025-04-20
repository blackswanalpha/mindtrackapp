import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useAnimation, useMotionValue, useSpring, useVelocity, useAnimationFrame } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  ListChecks,
  QrCode,
  Users,
  BarChart3,
  Brain,
  Mail,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Helper function for the ParallaxText component
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// Import custom fonts in _app.tsx or layout.tsx:
// import { Inter, Playfair_Display, DM_Sans } from 'next/font/google';

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
  linkTo,
  linkText = 'Learn More',
  adminFeature = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  linkTo: string;
  linkText?: string;
  adminFeature?: boolean;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      className="relative bg-white rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 opacity-70"></div>

      <div className="p-7 relative z-10 bg-white rounded-xl h-full flex flex-col">
        <div className="flex items-center mb-5">
          <div className={`p-3 rounded-lg ${
            adminFeature
              ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
              : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white'
          } shadow-md`}>
            {icon}
          </div>
          <h3 className="ml-4 text-xl font-bold text-slate-800 font-display">{title}</h3>
        </div>

        <p className="text-slate-600 mb-6 font-body leading-relaxed flex-grow">{description}</p>

        <Link
          href={linkTo}
          className={`inline-flex items-center text-sm font-medium ${
            adminFeature
              ? 'text-violet-600 hover:text-violet-800'
              : 'text-indigo-600 hover:text-indigo-800'
          } transition-all duration-300 group/link`}
        >
          {linkText}
          <ArrowRight className="ml-1 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

const StepCard = ({ step, title, description, delay, color }: { step: number; title: string; description: string; delay: number; color: string }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className="text-center relative"
    >
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mx-auto mb-5 relative z-10 border-2 shadow-md`}>
        <span className="text-xl font-bold">{step}</span>
      </div>
      <h3 className="text-2xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-slate-600 max-w-xs mx-auto font-body">{description}</p>
    </motion.div>
  );
};

const ParallaxText = ({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity?: number }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="font-bold text-6xl text-slate-100 flex whitespace-nowrap" style={{ x }}>
        <span className="block mr-4">{children} </span>
        <span className="block mr-4">{children} </span>
        <span className="block mr-4">{children} </span>
        <span className="block mr-4">{children} </span>
      </motion.div>
    </div>
  );
};

const SplashScreen = () => {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: false });

  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="font-sans bg-gradient-to-b from-slate-50 to-white">
      {/* Floating background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-violet-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
          <div className="relative z-10">
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-md">
                  <Sparkles className="inline-block w-4 h-4 mr-1.5 align-text-bottom" /> Mental Health Platform
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="block text-slate-800 font-display mb-2">Comprehensive</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 font-display">
                  Assessment Tools
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-6 max-w-2xl mx-auto text-xl text-slate-600 font-body leading-relaxed"
              >
                Create, distribute, and analyze mental health questionnaires with powerful AI-driven insights for better patient outcomes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  href="/admin/questionnaires"
                  className="px-8 py-4 rounded-full text-white font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Admin Dashboard
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </span>
                </Link>
                <Link
                  href="/respond/questionnaires/1"
                  className="px-8 py-4 rounded-full text-indigo-600 font-medium bg-white border border-indigo-200 hover:border-indigo-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center">
                    Try a Questionnaire
                    <ArrowRight className="ml-1 h-5 w-5" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-slate-300 flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-indigo-500"
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Marquee text section */}
      <div className="py-12 bg-indigo-600 overflow-hidden">
        <ParallaxText baseVelocity={-5}>Mental Health Assessment • Questionnaires • AI Analysis •</ParallaxText>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <span className="text-indigo-600 font-medium text-sm tracking-wider uppercase mb-3 block">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 font-display mb-6">
            Comprehensive Mental Health <br />Assessment Tools
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto font-body leading-relaxed">
            Our platform provides everything you need to create, distribute, and analyze mental health questionnaires with powerful insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Admin Features */}
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Create Questionnaires"
            description="Design custom mental health assessments with various question types to gather the information you need."
            delay={0.1}
            linkTo="/admin/questionnaires/create"
            linkText="Create Now"
            adminFeature={true}
          />

          <FeatureCard
            icon={<ListChecks className="h-6 w-6" />}
            title="Manage Questions"
            description="Add, edit, and organize questions to create comprehensive and effective assessments."
            delay={0.2}
            linkTo="/admin/questionnaires"
            adminFeature={true}
          />

          <FeatureCard
            icon={<QrCode className="h-6 w-6" />}
            title="Generate QR Codes"
            description="Create QR codes for easy distribution of questionnaires to clients and patients."
            delay={0.3}
            linkTo="/admin/questionnaires/1/qr-code"
            linkText="Generate QR Code"
            adminFeature={true}
          />

          {/* Client Features */}
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Answer Questionnaires"
            description="Clients can easily access and complete questionnaires on any device with a simple, intuitive interface."
            delay={0.4}
            linkTo="/respond/questionnaires/1"
            linkText="Try a Questionnaire"
          />

          {/* Admin Analysis Features */}
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="View & Score Responses"
            description="Review client responses and apply scoring systems to quantify assessment results."
            delay={0.5}
            linkTo="/admin/responses"
            adminFeature={true}
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="AI Analysis"
            description="Leverage AI to analyze responses and gain deeper insights into client mental health status."
            delay={0.6}
            linkTo="/admin/responses/1"
            linkText="See AI Analysis"
            adminFeature={true}
          />

          <FeatureCard
            icon={<Mail className="h-6 w-6" />}
            title="Email Communication"
            description="Send personalized emails to clients with their results and follow-up recommendations."
            delay={0.7}
            linkTo="/email/send"
            linkText="Send Email"
            adminFeature={true}
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-50 py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-20"
          >
            <span className="text-indigo-600 font-medium text-sm tracking-wider uppercase mb-3 block">Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 font-display mb-6">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto font-body leading-relaxed">
              Our streamlined process makes mental health assessment simple and effective.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-28 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-200 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
              <StepCard
                step={1}
                title="Create"
                description="Admins create questionnaires and questions"
                delay={0.1}
                color="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
              />
              <StepCard
                step={2}
                title="Distribute"
                description="Share via QR codes or direct links"
                delay={0.2}
                color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              />
              <StepCard
                step={3}
                title="Collect"
                description="Clients complete questionnaires"
                delay={0.3}
                color="bg-gradient-to-br from-violet-500 to-violet-600 text-white"
              />
              <StepCard
                step={4}
                title="Analyze"
                description="Review, score, and get AI insights"
                delay={0.4}
                color="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-8 py-16 md:p-16 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full opacity-10"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white rounded-full opacity-10"></div>
            </div>

            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-10 md:mb-0 md:max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-6">
                  Ready to transform your mental health assessments?
                </h2>
                <p className="text-xl text-indigo-100 font-body leading-relaxed">
                  Start creating questionnaires and gathering valuable mental health insights today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/admin/questionnaires"
                  className="px-8 py-4 rounded-full text-indigo-600 font-medium bg-white hover:bg-indigo-50 shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <span className="flex items-center justify-center">
                    Go to Dashboard
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </span>
                </Link>
                <Link
                  href="/respond/questionnaires/1"
                  className="px-8 py-4 rounded-full text-white font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <span className="flex items-center justify-center">
                    Try a Demo
                    <ArrowRight className="ml-1 h-5 w-5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
