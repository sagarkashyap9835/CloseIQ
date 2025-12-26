import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import HowItWorks from "../components/Work";
import Features from "../components/Features";
import Benefit from "../components/Benefit";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import Work from "../components/Work";


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories/>
      <Work />
      <Features />
      <Benefit />
      <Testimonials />
      <Footer />
    </>
  );
}
