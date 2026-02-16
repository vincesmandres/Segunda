import {
  Nav,
  Hero,
  ProblemSection,
  SolutionSection,
  SecuritySection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <SecuritySection />
      <Footer />
    </div>
  );
}
