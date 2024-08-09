import React from "react";
import FeatureSections from "./feature-sections";
import Hero from "./Hero";
import { TrustedBy } from "./TrustedBy";
import Footer from "./Footer";
import Header from "./Header";

function NewHomePage() {
  return (
    <>
      <Header />
      <Hero />
      <TrustedBy />
      <FeatureSections />
      <Footer />
    </>
  );
}

export default NewHomePage;
