import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MessageCircle,
  User,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateContactSubmission } from "@workspace/api-client-react";

const WHATSAPP_NUMBER = "2349130986279";

const SERVICES = [
  "High-Converting Website",
  "SEO & Digital Marketing",
  "AI Business Integration",
  "Website Maintenance",
  "White Label Services",
  "Brand Merchandise",
  "Full Package (All Services)",
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  website: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
}

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  website: "",
  service: "",
  message: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Please enter your full name";
  if (!form.phone.trim() || form.phone.trim().length < 7)
    errors.phone = "Please enter a valid phone number";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Please enter a valid email address";
  if (!form.service) errors.service = "Please select a service";
  if (!form.message.trim() || form.message.trim().length < 10)
    errors.message = "Tell us a little more (at least 10 characters)";
  return errors;
}

function buildWhatsAppText(form: FormState): string {
  return [
    `Hi Blaze Studio! I'd like a *Free Audit*. Here are my details:`,
    ``,
    `*Name:* ${form.name}`,
    `*Phone:* ${form.phone}`,
    `*Email:* ${form.email}`,
    form.website ? `*Website:* ${form.website}` : null,
    `*Interested in:* ${form.service}`,
    `*Message:* ${form.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const submission = useCreateContactSubmission();

  const set =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (serverError) setServerError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setServerError(null);

    try {
      await submission.mutateAsync({
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          website: form.website.trim() || undefined,
          service: form.service,
          message: form.message.trim(),
          source: "contact_form",
        },
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(
        "We couldn't save your request. Please try again, or send us your details on WhatsApp.",
      );
    }
  };

  const inputBase =
    "w-full bg-white border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  const isSubmitting = submission.isPending;

  return (
    <section
      id="contact-form"
      className="py-16 sm:py-20 lg:py-28 bg-secondary/40"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-primary/20 text-primary font-semibold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Free Audit
          </span>
          <h2 className="text-[clamp(1.875rem,6vw,3.25rem)] font-extrabold tracking-[-0.02em] text-foreground mb-3 sm:mb-4 leading-[1.1] text-balance">
            Let's See What Your Website
            <br className="hidden md:block" />
            <span className="text-primary"> Is Missing.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Fill in your details and we'll reach out with a personalised
            audit — no pressure, no fluff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="bg-white rounded-3xl border border-border shadow-xl p-12 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-extrabold text-foreground mb-3">
                Request received — thank you!
              </h3>
              <p className="text-muted-foreground mb-2">
                Your audit request is in. A member of our team will reach out
                within one business day.
              </p>
              <p className="text-muted-foreground mb-8">
                Want a faster reply? Send the same details on WhatsApp.
              </p>
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 h-14 rounded-xl shadow-lg"
                onClick={() =>
                  window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppText(form))}`,
                    "_blank",
                  )
                }
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Continue on WhatsApp
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-3xl border border-border shadow-xl p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-5"
            >
              {/* Row 1: Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" /> Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Tunde Adeyemi"
                    className={inputBase}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary" /> WhatsApp Number
                  </label>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+234 801 234 5678"
                    className={inputBase}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Email + Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-primary" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@company.com"
                    className={inputBase}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-primary" /> Current Website{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </label>
                  <input
                    value={form.website}
                    onChange={set("website")}
                    placeholder="www.yourwebsite.com"
                    className={inputBase}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Service */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <ChevronDown className="w-4 h-4 text-primary" /> What do you
                  need help with?
                </label>
                <div className="relative">
                  <select
                    value={form.service}
                    onChange={set("service")}
                    className={`${inputBase} appearance-none pr-10 cursor-pointer`}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Select a service...
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.service && (
                  <p className="text-xs text-destructive">{errors.service}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Tell us about your business
                </label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  rows={4}
                  placeholder="What does your business do? What's your biggest challenge right now?"
                  className={`${inputBase} resize-none`}
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">{errors.message}</p>
                )}
              </div>

              {serverError && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-[1.02] active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      Get My Free Audit
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1 h-14 text-base font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={() =>
                    window.open(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Blaze Studio! I'd like to learn more about your services.")}`,
                      "_blank",
                    )
                  }
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp Us
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-1">
                We reply within one business day. No spam, ever.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
