import { HeroSection } from "@/components/home/hero-section";
import { TruthSection } from "@/components/home/truth-section";
import { IntroSection } from "@/components/home/intro-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { CoursesPreview } from "@/components/home/courses-preview";
import { TestimonialsPreview } from "@/components/home/testimonials-preview";
import { CTASection } from "@/components/home/cta-section";
import { FAQSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TruthSection />
      <IntroSection />
      <BenefitsSection />
      <CoursesPreview />
      <TestimonialsPreview />
      <FAQSection />
      <CTASection />
    </>
  );
}
