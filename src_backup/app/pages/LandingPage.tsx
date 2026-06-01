import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { CurvedScrollingText } from "../components/CurvedScrollingText";
import { ScrollingText } from "../components/ScrollingText";
import { OurStory } from "../components/OurStory";
import { WhyToastmasters } from "../components/WhyToastmasters";
import { PrincipalMessage } from "../components/PrincipalMessage";
import { Feedback } from "../components/Feedback";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden w-full">
      <Header />
      <HeroSection />
      <CurvedScrollingText text="KLECET TOASTMASTERS CLUB" />
      <OurStory />
      <WhyToastmasters />
      <ScrollingText text="BETTER COMMUNICATION • BETTER OPPORTUNITIES" />
      <PrincipalMessage />
      <Feedback />
      <Footer />
    </div>
  );
}
