import SiteLayout from "@/components/layout/site-layout";
import Services from "@/components/sections/services";
import Process from "@/components/sections/process";
import Cta from "@/components/sections/cta";

export default function ServicesPage() {
  return (
    <SiteLayout>
      <div className="pt-24">
        <Services />
        <Process />
        <Cta />
      </div>
    </SiteLayout>
  );
}
