import SiteLayout from "@/components/layout/site-layout";
import Portfolio from "@/components/sections/portfolio";
import Cta from "@/components/sections/cta";

export default function PortfolioPage() {
  return (
    <SiteLayout>
      <div className="pt-24">
        <Portfolio />
        <Cta />
      </div>
    </SiteLayout>
  );
}
