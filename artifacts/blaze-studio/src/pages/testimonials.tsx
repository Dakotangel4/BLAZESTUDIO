import SiteLayout from "@/components/layout/site-layout";
import Testimonials from "@/components/sections/testimonials";
import Cta from "@/components/sections/cta";

export default function TestimonialsPage() {
  return (
    <SiteLayout>
      <div className="pt-24">
        <Testimonials />
        <Cta />
      </div>
    </SiteLayout>
  );
}
