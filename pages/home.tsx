/**
 * Home page - Central dashboard with Pace Yo'self as main feature + navigation cards
 * Core Features: Reading streak check-in, navigation to all main sections
 * Migrated from App Router to Pages Router for iOS Capacitor compatibility
 */

import { MobileLayout } from '../src/components/mobile-layout';
import PWAInstallPrompt from '../src/components/pwa-install-prompt';
import { ReadingStreak } from '../src/features/home/reading-streak';
import { NavigationCard } from '../src/components/navigation-card';
import { AnimatedEntrance, StaggeredList, PageTransition, FloatingElement } from '../src/components/animated-entrance';
import { AnimatedButton, GradientButton, PrimaryButton } from '../src/components/animated-button';
import { PageLoading, InlineLoading } from '../src/components/page-loading';
import { SkeletonGrid } from '../src/components/skeleton-loader';
import { useEffect, useState } from 'react';
import Head from 'next/head';

const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMounted(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleQuickAction = async (action: string) => {
    setQuickActionLoading(action);
    // Simulate action loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    setQuickActionLoading(null);
    // In real app, would navigate or show modal
    alert(`${action} action completed!`);
  };
  
  // Show loading screen initially
  if (isLoading) {
    return <PageLoading message="Loading your reading dashboard..." showProgress={true} progress={75} />;
  }

  return (
    <>
      <Head>
        <title>Home - Stacks</title>
        <meta name="description" content="Your reading dashboard - track your pace and navigate to all features" />
      </Head>
      
      <MobileLayout>
        <PageTransition>
          <div className="px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
            {/* Welcome Section */}
            <AnimatedEntrance animation="fadeInUp" className="text-center">
              <FloatingElement>
                <div className="text-6xl mb-4">📚</div>
              </FloatingElement>
              <h1 className="mb-2 text-huge font-black leading-extra-tight text-text-primary">
                <span className="text-primary-purple">WELCOME</span>
                <br />
                <span className="text-mega">BACK!</span>
              </h1>
              <p className="text-lg font-bold text-text-secondary">
                Ready to pace yo'self today?
              </p>
            </AnimatedEntrance>

            {/* Main Feature - Pace Yo'self */}
            <AnimatedEntrance animation="scaleIn" delay={200}>
              <ReadingStreak />
            </AnimatedEntrance>

            {/* Navigation Cards Grid */}
            <AnimatedEntrance animation="fadeInUp" delay={400}>
              <h2 className="mb-6 text-center text-xl-bold font-black text-text-primary">
                🚀 Explore Stacks
              </h2>
              <StaggeredList stagger={150} className="grid grid-cols-2 gap-4">
                <NavigationCard
                  title="DISCOVER"
                  subtitle="Find books that hit different"
                  href="/discover"
                  gradient="bg-gradient-to-br from-primary-blue to-primary-teal"
                  icon="🔍"
                />
                
                <NavigationCard
                  title="LEARN"
                  subtitle="Stack knowledge like books"
                  href="/learn"
                  gradient="bg-gradient-to-br from-primary-purple to-primary-pink"
                  icon="🎓"
                />
                
                <NavigationCard
                  title="MY STACKS"
                  subtitle="Your reading empire"
                  href="/mystacks"
                  gradient="bg-gradient-to-br from-primary-orange to-primary-pink"
                  icon="📚"
                />
                
                <NavigationCard
                  title="COMMUNITY"
                  subtitle="Where book nerds unite"
                  href="/stackstalk"
                  gradient="bg-gradient-to-br from-primary-green to-primary-teal"
                  icon="👥"
                />
              </StaggeredList>
            </AnimatedEntrance>

            {/* Quick Actions Strip */}
            <AnimatedEntrance animation="fadeInUp" delay={800}>
              <h3 className="mb-4 text-center text-lg font-black text-text-primary">
                ⚡ Quick Actions
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[
                  { icon: '📖', label: 'Continue Reading', action: 'continue-reading' },
                  { icon: '➕', label: 'Quick Add Book', action: 'add-book' },
                  { icon: '📸', label: 'Scan Shelf', action: 'scan-shelf' },
                  { icon: '💬', label: 'Join Discussion', action: 'join-discussion' }
                ].map((item, index) => (
                  <AnimatedButton
                    key={item.action}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 bg-white border-white shadow-card"
                    isLoading={quickActionLoading === item.action}
                    loadingText="Loading..."
                    onClick={() => handleQuickAction(item.action)}
                    animation="bounce"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </AnimatedButton>
                ))}
              </div>
            </AnimatedEntrance>
            
            {/* Demo Loading State */}
            {!mounted && (
              <div className="mt-8">
                <h3 className="mb-4 text-center text-lg font-black text-text-primary">
                  📚 Your Recent Activity
                </h3>
                <SkeletonGrid count={2} type="book" />
              </div>
            )}
            
            {/* Demo Success Message */}
            {mounted && (
              <AnimatedEntrance animation="scaleIn" delay={1000}>
                <div className="mt-8 bg-primary-green/10 border-2 border-primary-green/20 rounded-3xl p-6 text-center">
                  <div className="text-4xl mb-2">✨</div>
                  <h3 className="font-black text-primary-green mb-2">You're All Set!</h3>
                  <p className="text-text-secondary">All features loaded with smooth animations and loading states</p>
                </div>
              </AnimatedEntrance>
            )}
            </div>
          </div>
        </PageTransition>
        <PWAInstallPrompt />
      </MobileLayout>
    </>
  );
};

export default HomePage;