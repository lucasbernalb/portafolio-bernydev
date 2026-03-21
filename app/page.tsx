import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <section id="contact" className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Ready to build something amazing together? Let&apos;s connect.
          </p>
        </div>
      </section>
    </main>
  );
}
