import Pricing from "../components/HomePage/Pricing";
import Header from "../components/HomePage/Header";
import HeaderMobile from "../components/HomePage/HeaderMobile";

export default function PricingPage() {
    return(
        <>
        <Header />
        <HeaderMobile />
        <div className="bg-[#052727]">
        <Pricing />
      </div>
    
    </>
    )
}