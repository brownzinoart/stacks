"use client";

import { useState } from "react";
import Modal from "./Modal";
import { BookOpen, Compass, Eye, Sparkles } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type OnboardingScreen = {
  icon: typeof BookOpen;
  title: string;
  description: string;
  gradient: string;
};

const screens: OnboardingScreen[] = [
  {
    icon: BookOpen,
    title: "Create Book Stacks",
    description:
      "Build collections of books around any vibe, theme, or mood. Share your perfect reading lists with the community.",
    gradient: "bg-gradient-primary",
  },
  {
    icon: Compass,
    title: "Discover New Books",
    description:
      "Find your next read through vibe-based search. Tell us what you're feeling and we'll match you with perfect books.",
    gradient: "bg-gradient-accent",
  },
  {
    icon: Eye,
    title: "See Your Matches",
    description:
      "Every book gets a match score based on your taste. High matches? Probably your new favorite. Already read it? We'll show that too.",
    gradient: "bg-gradient-info",
  },
  {
    icon: Sparkles,
    title: "You're All Set!",
    description:
      "Start building stacks, discovering books, and connecting with other readers. Let's find your next great read.",
    gradient: "bg-gradient-success",
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      if (onComplete) onComplete();
      onClose();
    }
  };

  const handleSkip = () => {
    if (onComplete) onComplete();
    onClose();
  };

  const screen = screens[currentScreen];
  if (!screen) return null;
  const ScreenIcon = screen.icon;
  const isLastScreen = currentScreen === screens.length - 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      showCloseButton={false}
    >
      <div className="space-y-8 py-4">
        {/* Icon */}
        <div className={`${screen.gradient} w-24 h-24 mx-auto rounded-[20px] border-[5px] border-light-border dark:border-dark-border shadow-brutal flex items-center justify-center`}>
          <ScreenIcon className="w-12 h-12 stroke-[3] text-white" />
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-light-text dark:text-dark-text">
            {screen.title}
          </h2>
          <p className="text-base font-semibold text-light-textSecondary dark:text-dark-textSecondary">
            {screen.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {screens.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentScreen(idx)}
              className={`w-3 h-3 rounded-full border-[2px] border-light-border dark:border-dark-border transition-all ${
                idx === currentScreen
                  ? "bg-accent-cyan scale-125"
                  : "bg-light-borderSecondary dark:bg-dark-borderSecondary"
              }`}
              aria-label={`Go to screen ${idx + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t-[5px] border-light-border dark:border-dark-border">
          {!isLastScreen && (
            <button
              onClick={handleSkip}
              className="flex-1 btn-brutal bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className={`${isLastScreen ? 'w-full' : 'flex-1'} btn-brutal bg-accent-cyan text-white`}
          >
            {isLastScreen ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
