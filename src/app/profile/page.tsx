/**
 * Profile page - User settings and reading history
 */

import { MobileLayout } from '@/components/mobile-layout';

const ProfilePage = () => {
  return (
    <MobileLayout>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
          {/* Profile Header */}
          <div className="animate-fade-in-up pop-element-lg relative overflow-hidden rounded-3xl bg-primary-green p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
            <div className="relative z-10">
              <h1 className="mb-4 text-huge font-black leading-extra-tight text-text-primary sm:mb-6">
                <span className="text-primary-orange">MY</span>
                <br />
                <span className="text-mega">PROFILE</span>
              </h1>
              <p className="mb-6 text-lg font-bold leading-tight text-text-primary sm:mb-8 sm:text-xl">
                Your reading journey starts here!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="animate-float absolute left-6 top-6 z-0 h-16 w-16 rounded-full bg-primary-yellow opacity-30 sm:h-20 sm:w-20" />
            <div className="animate-float-delayed absolute right-12 top-2 z-0 h-12 w-12 rounded-full bg-primary-purple opacity-25 sm:h-16 sm:w-16" />
            <div className="animate-float-slow absolute bottom-6 right-6 z-0 h-8 w-8 rounded-full bg-primary-teal opacity-40 sm:h-12 sm:w-12" />
          </div>

          {/* Profile Content */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="rounded-3xl bg-white p-8 shadow-card">
              <div className="text-center">
                <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-primary-orange">
                  <img src="/avatar.png" alt="Profile" className="h-full w-full object-cover" />
                </div>
                <h2 className="mb-2 text-2xl font-black text-text-primary">Reader Name</h2>
                <p className="text-lg font-bold text-text-secondary">Member since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;