
import { LandingHeader } from './landing/LandingHeader';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { EmotionalTrackingSection } from './landing/EmotionalTrackingSection';
import { ComingSoonSection } from './landing/ComingSoonSection';
import { CTASection } from './landing/CTASection';
import { LandingFooter } from './landing/LandingFooter';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      <LandingHeader onGetStarted={onGetStarted} />
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <EmotionalTrackingSection />
      <ComingSoonSection onGetStarted={onGetStarted} />
      <CTASection onGetStarted={onGetStarted} />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
