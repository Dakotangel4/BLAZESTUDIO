import SiteLayout from "@/components/layout/site-layout";
import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import Brands from "@/components/sections/brands";
import WhyUs from "@/components/sections/why-us";
import Testimonials from "@/components/sections/testimonials";
import TrustedByBar from "@/components/sections/trusted-by-bar";
import Cta from "@/components/sections/cta";

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Brands />
      <WhyUs />
      <TrustedByBar />
      <Testimonials />
      <Cta />
    </SiteLayout>
  );
}
