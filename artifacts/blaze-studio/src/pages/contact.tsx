import SiteLayout from "@/components/layout/site-layout";
import Problem from "@/components/sections/problem";
import ContactForm from "@/components/sections/contact-form";
import Faq from "@/components/sections/faq";

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className="pt-24">
        <Problem />
        <ContactForm />
        <Faq />
      </div>
    </SiteLayout>
  );
}
