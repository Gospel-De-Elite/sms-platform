import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import UseCases from "./components/UseCases";
import Pricing from "./components/Pricing";
import Developers from "./components/Developers";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function LandingPage() {
    return (
        <div className="bg-slate-950">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <HowItWorks />
            <UseCases />
            <Pricing />
            <Developers />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    );
}