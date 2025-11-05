import React from "react";
import NavBar from "../components/layout/NavBar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/layout/Footer";

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
