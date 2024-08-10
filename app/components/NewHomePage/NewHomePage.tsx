import React from "react";
import FeatureSections from "./feature-sections";
import Hero from "./Hero";
import { TrustedBy } from "./TrustedBy";
import Footer from "./Footer";
import Header from "./Header";
import { AnimatedBeamMultipleOutputDemo } from "./allbeam";
import Comparison from "./comparison";
import FAQ from "./faqs";

function NewHomePage() {
  return (
    <>
      <Header />
      <Hero />
      <TrustedBy />
      <Comparison />
      <FeatureSections />
      <FAQ />
      <Footer />
    </>
  );
}

export default NewHomePage;
