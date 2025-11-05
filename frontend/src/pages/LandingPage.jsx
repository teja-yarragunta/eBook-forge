import React from "react";
import NavBar from "../components/layout/NavBar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <Features />
    </div>
  );
};

export default LandingPage;
