import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedContent from "@/components/AnimatedContent";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <AnimatedContent>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </AnimatedContent>
    </>
  );
}
